import { ApiResponse, User } from "./types"

export const handleError = (error: string) => error === 'Internal server error' ? 'Oops! something went wrong!' : error

export const register = async <T>(requestBody: Record<string, string>): Promise<ApiResponse<T>> => {
  try {
    const req = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-type': 'application/json'
        }
    })
    const response = await req.json()
    if(response.ok) {
      return {
        ok: req.ok,
        data: response as T
    }} else {
      return {
        ok: req.ok,
        error: handleError(response.error)
    }}
  } catch (e) {
    return {
        ok: false,
        error: 'Oops! something went wrong!'
    }
  }
}

export const forgotPassword =  async <T>(email: string) => {
  const body = { email }

  try {
    const req = await fetch(`http://localhost:3000/api/forgot_password`, {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-type': 'application/json'
        }
    })
    const response = await req.json()

    return {
        ok: req.ok,
        data: response as T
    }
  } catch (e) {
    return {
        ok: false,
        error: 'Oops! something went wrong!'
    }
  }
}

export const resetPassword = async <T>(requestBody: Record<string, string>): Promise<ApiResponse<T>> => {
  const body = {
    password:requestBody.password,
    email: requestBody.email,
    token: requestBody.token
  }
  try {
    const req = await fetch('http://localhost:3000/api/reset_password', {
        method: 'PATCH',
        body: JSON.stringify(body),
        headers: {
          'Content-type': 'application/json'
        }
    })
    const response = await req.json()
    if(response.ok) {
      return {
        ok: req.ok,
        data: response as T
    }} else {
      return {
        ok: req.ok,
        error: handleError(response.error)
    }}
  } catch (e) {
    return {
        ok: false,
        error: 'Oops! something went wrong!'
    }
  }
}

export const login = async<T>(requestBody: Record<string, string>) => {
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

    if(req.ok) {
      localStorage.setItem('token', response.token)
      localStorage.setItem('name', response.name)
      localStorage.setItem('id', response.id)
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
        error: 'Oops! something went wrong!'
    }
  }
}

export const fetchTasks = async (param?: Record<string, boolean> | null) => {
  const token = localStorage.getItem('token') || ''
  const userId = localStorage.getItem('id') || ''

  if(!!userId && !!token) {
    try {
      const queryParam = { id: userId, ...(param && param) }
      const req = await fetch(`http://localhost:3000/api/tasks?${new URLSearchParams(queryParam)}`, {
          method: 'GET',
          headers: {
            'Authorization': token
          }
      })
      const response = await req.json()
      return {
          ok: req.ok,
          statusCode: req.status,
          data: response
      }
    } catch (e) {
      return {
          ok: false,
          statusCode: 500,
          error: 'Oops! something went wrong!'
      }
    }
  } else {
    return {
      ok: false,
      statusCode: 401,
      error: 'Oops! something went wrong!'
  }
  } 
}

export const patchTask = async <T>(id: string, requestBody: Record<string, string | boolean>) => {
  const token = localStorage.getItem('token') as string

  try {
    const req = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-type': 'application/json',
          'Authorization': token,
        }
    })
    const response = await req.json()

    return {
        ok: req.ok,
        data: response as T
    }
  } catch (e) {
    return {
        ok: false,
        error: 'Oops! something went wrong!'
    }
  }
}

export const addTask = async (body: Record<string, string | number> ) => {
  const token = localStorage.getItem('token') as string
  try {
    const req = await fetch(`http://localhost:3000/api/tasks/new`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-type': 'application/json',
          'Authorization': token
        }
    })
    const response = await req.json()
    return {
        ok: req.ok,
        data: response
    }
  } catch (e) {
    return {
        ok: false,
        error: 'Oops! something went wrong!'
    }
  }
}

export const reorderTasks = async (requestBody: Record<string, string | number>[]) => {
  const token = localStorage.getItem('token') as string
  try {
    const req = await fetch(`http://localhost:3000/api/reorder_tasks`, {
      method: 'PATCH',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-type': 'application/json',
        'Authorization': token
      }
  })
    return {
        ok: req.ok
    }
  } catch (e) {
    return {
        ok: false,
        error: 'Oops! something went wrong!'
    }
  }
}

export const deleteTask = async (id: string) => {
  const token = localStorage.getItem('token') as string
  try {
    const req = await fetch(`http://localhost:3000/api/tasks/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token
        }
    })
    return {
        ok: req.ok
    }
  } catch (e) {
    return {
        ok: false,
        error: 'Oops! something went wrong!'
    }
  }
}