import { useState } from "react"

import { User } from "./types"
import { handleError } from "./helpers"

const useUserDataHook = () => {
  const [userInfo, setUserInfo] = useState<User | null>(null)

  const login = async<T>(requestBody: Record<string, string>) => {
    try {
      const req = await fetch('http://localhost:3000/api/authenticate', {
          method: 'POST',
          body: JSON.stringify(requestBody),
          headers: {
            'Content-type': 'application/json',
            'credentials': 'include'
          }
      })
      const response = await req.json()
  
      if(response.ok) {
        
        setUserInfo(response)
        return {
          ok: req.ok,
          data: response
      }} else {
        return {
          ok: req.ok,
          error: handleError(response.error)
      }}
    } catch (e) {
      return {
          ok: false,
          error: { error: 'Oops! something went wrong!' }
      }
    }
  }

  return {
    userInfo,
    login
  }
}

export default useUserDataHook