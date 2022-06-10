import React,{useEffect} from 'react'

import { useAppProvider } from '../context/actasContext/AppProvider'
import { useAuth } from '../context/userContext/UserProvider'
import axios from 'axios'

import ListUsers from '../components/adminUsers/ListUsers'
import AddUserForm from '../components/adminUsers/AddUserForm'


const AdminUsers = () => {

   

    const {setUserBd,userBd} = useAppProvider()
    const {setUser} = useAuth()

    useEffect(()=>{
        console.log('getting user useEffect')
        const getUser = async()=>{

            const token = JSON.parse(localStorage.getItem('uid'))
            if(!token){
                setUser('')
                return
            }
            const config = {
                headers:{
                    Authorization: `Bearer ${token.token}` 
                }
            }
            try {
                
                const endPoint = `${import.meta.env.VITE_BASE_URL}/user/ver-usuario`
                const {data} = await axios(endPoint,config)
                console.log(data)
                setUserBd(data)
            } catch (error) {
                console.log(error)
            }
        }

        getUser()


    },[userBd.length])
    
    
    console.log('pagina admin user')

  return (
    <div >
    <AddUserForm  />

    <ListUsers  userBd={userBd} />

    </div>
  )
}

export default AdminUsers