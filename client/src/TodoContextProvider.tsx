import { ReactElement, createContext, useMemo } from "react"
import useUserDataHook from "./useUserDataHook"
import { User } from "./types"

interface ToDoContextInterface {
  userInfo: User | null,
  login: any
}

export const ToDoContext = createContext<ToDoContextInterface>(undefined)

export const ToDoContextProvider = ({ children }: { children: ReactElement[] }) => {
  const { userInfo, login} = useUserDataHook()  
 
  const value = useMemo(() => {
    return {userInfo, login}
  }, [userInfo])

  return <ToDoContext.Provider value={value} >{children}</ToDoContext.Provider>  
}