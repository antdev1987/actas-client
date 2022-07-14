import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/userContext/UserProvider'


const PrivateRouteAdmin = () => {

  const {user} = useAuth()

  return (    
    <>
    {user.role === 'admin' ?(
         <div className=' bg-secondary bg-opacity-10 min-vh-100'>
         <Outlet />
       </div>
    ):<Navigate to='/busqueda'/>}
    </>
  )
}

export default PrivateRouteAdmin