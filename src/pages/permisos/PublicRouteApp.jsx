import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/userContext/UserProvider'


const PublicRouteApp = () => {

  const {user} = useAuth()

  return (
    
    <>

    {!user.role ?(
      <div className='bg-secondary bg-opacity-10 vh-100'>
        <Outlet />
      </div>
    ):<Navigate to='/registro-actas' replace/>}
    
    </>



  )
}

export default PublicRouteApp