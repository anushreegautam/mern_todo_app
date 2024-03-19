import React, { BaseSyntheticEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react"
import  AddIcon  from "@mui/icons-material/Add"
import { useNavigate } from 'react-router-dom'

import { DndContext, useSensors, useSensor, PointerSensor, KeyboardSensor, closestCenter, DragEndEvent, TouchSensor, MouseSensor } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable"

import { addTask, fetchTasks, reorderTasks } from "./helpers"
import Task from "./Task"
import { Task as TaskType } from './types'
import Spinner from "./Spinner"
import Layout from "./Layout"

const Home = () => {
  const navigate = useNavigate()
  const [newTask, setNewTask] = useState<string>('')
  const [tasks, setTasks] = useState<TaskType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingNewTask, setIsSavingNewTask] = useState(false)
  const [inEditMode, setInEditMode] = useState<{ id: string | null }>({ id: null })
  const [activeTab, setActiveTab] = useState('all')

  const handleNewTaskChange = (e: { target: {value: string}} ) => setNewTask(e.target.value)

  const handleSetEditable = (id: string | null) => setInEditMode({ id: id })

  const initialRender = useRef(true)

  const getFilterParam = (type?: string) => {
    switch (type) {
      case 'pending': return { is_completed: false }
      case 'completed': return { is_completed: true }
      default: return null
    }
  }

  const getTasks = (tab?: string) => {
    setIsLoading(true)
    const param = getFilterParam(tab)

    fetchTasks(param).then(res => {
      if(res.ok) {
        setTasks(res.data)
      } else {
        if(res.statusCode === 401) {
          navigate('/login')
        }
      }
    }).finally(() => setIsLoading(false))
   }

  useEffect(() => { 
  if(initialRender.current) {
    getTasks()
    initialRender.current = false
  }
  }, [initialRender])

  const handleChange = (updatedTask: TaskType, type?: string) => {
    if(type === 'DELETE') {
      setTasks(prevState => prevState.filter(task => task._id !== updatedTask._id))
    }
    setTasks(prevState => prevState.map(task => task._id === updatedTask._id ? updatedTask : task ))
    setInEditMode({ id: null })
  }

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const {active, over} = event
  
    if (active.id !== over?.id) {
      const oldArray = tasks
      const oldIndex = tasks.findIndex(task => task._id === active.id) as number
      const newIndex = tasks.findIndex(task => task._id === over?.id) as number
      
      const newArray = arrayMove(tasks, oldIndex, newIndex)
      setTasks(newArray)

      const body = newArray.map((data, index) => ({ id: data._id, sort_order: index + 1 }))

      reorderTasks(body).then((response) => {
        if(response.ok) {
          fetchTasks().then(res => {
            if(res.ok) {
              const data = res.data as TaskType[]
              setTasks(data)
            }
          })
        } else {
          setTasks(oldArray)
        }
      }).catch(e => {
        setTasks(oldArray)
      })
    }
  }

  const saveNewTask = useCallback((e: FormEvent) => {
    e.preventDefault()
    setIsSavingNewTask(true)
    const lastSortOrder = tasks.length ? tasks[0].sort_order : 0
    addTask({title: newTask, sort_order: lastSortOrder + 1 }).then(response => {
      if(response.ok) {
        setTasks(prevState => [response.data, ...prevState])
        setNewTask('')
        setIsSavingNewTask(false)
        fetchTasks().then(res => {
          if(res.ok) {
            const data = res.data 
            setTasks(data)
          }
        })
      }
    })
  }, [newTask, tasks, setNewTask])

  const getActiveTabClassname = (value: string) => activeTab === value ? 'active-tab' : ''

  const handleTabChange = (e: BaseSyntheticEvent) => {
    setActiveTab(e.target.name)
    getTasks(e.target.name)
  }

  return (
    <Layout>
    <div className="main-container">
      <form className="add-task-container" onSubmit={saveNewTask}>
       <input required type="text" id="new-task" name="new-task" value={newTask} disabled={isSavingNewTask} placeholder="Add a new task here..." onChange={handleNewTaskChange} />
       <button type="submit"><AddIcon /></button>
      </form> 
      <Spinner open={isLoading} />
      <div>
        <ul className="task-filter" >
          <li className={getActiveTabClassname('all')} ><input type="button" name="all" onClick={handleTabChange} value="All" /></li>
          <li className={getActiveTabClassname('pending')} ><input type="button" name="pending" onClick={handleTabChange} value="Pending" /></li>
          <li className={getActiveTabClassname('completed')} ><input type="button" name="completed" onClick={handleTabChange} value="Completed" /></li>
        </ul>
      <div className="listing-container">
        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
      <SortableContext 
        items={tasks.map(task => task._id)}
        strategy={verticalListSortingStrategy}
      >  
        { !isLoading && (tasks.length > 0 ?  
        tasks.map((task) => <Task key={`task-id-${task._id}`} data={task} handleChange={handleChange} inEditMode={inEditMode} activeTab={activeTab} handleSetEditable={handleSetEditable} />) 
       : <span>Let's jot down some new tasks...</span>) }   
        </SortableContext>
        </DndContext>
      </div>
      </div>
    </div>
    </Layout>
  )
}

export default Home