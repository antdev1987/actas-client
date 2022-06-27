import axios from 'axios'

import { createContext,useContext,useState } from 'react'

import {useNavigate} from 'react-router-dom'
import { useAppProvider } from '../actasContext/AppProvider'

const UserContext = createContext()

export const UserProvider= props=>{

    const [user,setUser]= useState(JSON.parse(localStorage.getItem('uid')) || '')

 
    const [isUserActiveLoading,setIsUserActiveLoading] = useState(false)




    const navigate = useNavigate()



    const loginUserfn =async(userData, setError)=>{

        // https://actas-server.herokuapp.com/api/user/login
        
        try {
            setIsUserActiveLoading(true)

            const endPoint = `http://192.168.100.248:4000/api/user/login`
            //const endPoint = `https://actas-server.herokuapp.com/api/user/login`

            const {data}= await axios.post(endPoint,userData)
            // Swal.fire({
            //     icon: 'success',
            //     title: 'Espera...',
            //     text: 'Usuario autenticado',
            //   })
            console.log(data)

            localStorage.setItem('uid', JSON.stringify(data));
            setIsUserActiveLoading(false)
            setUser(data)
        } catch (error) {
            // Swal.fire({
            //     icon: 'error',
            //     title: 'Oops...',
            //     text: error.response.data.msg,
            //   })
            console.log(error.response.data.msg)
            setError(error.response.data.msg)
            setIsUserActiveLoading(false)
        }
    }

    const logoutUserfn =()=>{
        localStorage.clear()
        setUser('')
        navigate('/')
    }


    return (
        <UserContext.Provider
        value={{
            user,
            isUserActiveLoading,

            setUser,
            loginUserfn,
            logoutUserfn
        }}
        >
            {props.children}
        </UserContext.Provider>
    )
}

export const useAuth =()=>{
    return useContext(UserContext)
}