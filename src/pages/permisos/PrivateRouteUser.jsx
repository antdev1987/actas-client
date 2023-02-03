import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/userContext/UserProvider'

const PrivateRouteUser = () => {

  const {user} = useAuth()


  console.log(user)

  return (
    
    <>

    {user.role === 'user' || user.role === 'admin' ?(
          <div>
          <Outlet />
        </div>
    ):<Navigate to='/'/>}
    
    </>



  )
}

export default PrivateRouteUser