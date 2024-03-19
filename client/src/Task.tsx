import React, { useEffect, useState } from "react"
import CircleOutlinedIcon from '@mui/icons-material/CircleOutlined'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined'
import CheckIcon from '@mui/icons-material/Check'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import { useSortable } from '@dnd-kit/sortable'
import {CSS} from '@dnd-kit/utilities'
import { deleteTask, patchTask } from "./helpers"
import {ApiResponse, Task as TaskTypes} from './types'

const Task = ({ data, inEditMode, activeTab, handleChange, handleSetEditable }: { data: TaskTypes, inEditMode: { id: string | null }, activeTab: string , handleChange: (updatedTask: TaskTypes, type?: string ) => void , handleSetEditable: (id: string | null) => void }) => {
  const [task, setTask] = useState(data)

  useEffect(() => {
    setTask(data)
  }, [data])


  const handleEditMode = () => {
    if(!inEditMode.id)
     handleSetEditable(task._id)
  }

  const handleTaskChange = (key: string, value: string | boolean ) => {
    setTask(prevState => ({...prevState, [key]: value}))
  }

  const handleDeleteTask = () => {
    deleteTask(task._id).then(response => {
      if(response.ok) {
        handleChange(task, 'DELETE')
      }
    })
   }

  useEffect(() => {
    const titleElement = document.getElementById(`task-title-${task._id}`)
    titleElement?.addEventListener('click', handleEditMode )

    return titleElement?.removeEventListener('click', handleEditMode)
  }, [task._id, handleEditMode])

  const handleSaveTitle = () => {
    const currentTask = data
    handleChange(task)
    patchTask<ApiResponse<TaskTypes>>(task._id, { title: task.title }).then(response => {
      if(!response.ok) {
        handleChange(currentTask)
      }
    })
  }

  const updaetTaskStatus = () => {
    const currentTask = data
    handleChange({...task, is_completed: !task.is_completed})
    patchTask(task._id,  { is_completed: !task.is_completed }).then(response => {
      if(!response.ok) {
        handleChange(currentTask)
      }
    })
  }

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({id: task._id});
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const resetTitle = () => {
    setTask(data)
    handleSetEditable(null)
  }

  const handleClose = () => inEditMode.id ? resetTitle() : handleDeleteTask()

  return  (
    <div  className="task-container" ref={setNodeRef} {...attributes} style={style}>
      <button className="task-status-icon"  onClick={updaetTaskStatus} >{task.is_completed ? <CheckCircleOutlineOutlinedIcon  /> : <CircleOutlinedIcon   sx={{ color: 'gray' }} /> }</button> 
      { inEditMode.id === task._id ? (
        <form onSubmit={handleSaveTitle}>
          <input required type="text" id={`task-title-input-${task._id}`} name="title" value={task.title} onChange={(e) => handleTaskChange('title', e.target.value)} />
          <button type="submit"><CheckIcon /></button>
        </form>
      ) : <>
      <p id={`task-title-${task._id}`} onClick={handleEditMode} >{data.title}</p> 
      { (!inEditMode.id && activeTab === 'all') && <div  {...listeners} ref={setActivatorNodeRef}  className="drag-handle-icon"><DragIndicatorIcon  /> </div> }
      </>
      }
      <button onClick={handleClose} ><CloseOutlinedIcon /></button>
    </div>  
  )
}

export default Task