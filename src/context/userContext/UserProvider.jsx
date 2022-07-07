import axios from 'axios'

import { createContext, useContext, useState } from 'react'

import { useNavigate } from 'react-router-dom'


const UserContext = createContext()

export const UserProvider = props => {

    const [user, setUser] = useState(JSON.parse(localStorage.getItem('uid')) || '')
    const [isUserActiveLoading, setIsUserActiveLoading] = useState(false)
    const [movientosUsuarios, setMovimientosUsuarios] = useState([])



    const navigate = useNavigate()

    console.log('arriba de este')
    console.log(`${import.meta.env.VITE.URL} probando variable de ambiente`)

    const loginUserfn = async (userData, setError) => {

        // https://actas-server.herokuapp.com/api/user/login


        try {
            setIsUserActiveLoading(true)

            //const endPoint = `http://192.168.100.248:4000/api/user/login`
            //const endPoint = `https://actas-server.herokuapp.com/api/user/login`

            const endPoint = `${import.meta.env.VITE.URL}/user/login`

            const { data } = await axios.post(endPoint, userData)
            // Swal.fire({
            //     icon: 'success',
            //     title: 'Espera...',
            //     text: 'Usuario autenticado',
            //   })

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


    const movientosUsuariosfn = async()=>{
        console.log('en user provider funcion movientos usuarios')

        const token = JSON.parse(localStorage.getItem('uid'));
        if (!token) {
          setUser('');
          return;
        }
        const config = {
          headers: {
            Authorization: `Bearer ${token.token}`,
          },
        };
        try {
           const endPoint = `https://actas-server.herokuapp.com/api/user/movimientos-usuarios`
          //const endPoint = `http://192.168.100.248:4000/api/user/movimientos-usuarios`;
          const { data } = await axios.get(endPoint, config);
          
          setMovimientosUsuarios(data)
          console.log(data, 'funtion movientos usuarios');
          
        } catch (error) {
          console.log(error.response.data.msg);
        }

    }

    /////////////////////////
    const logoutUserfn = () => {
        localStorage.clear()
        setUser('')
        navigate('/')
    }


    return (
        <UserContext.Provider
            value={{
                user,
                isUserActiveLoading,
                movientosUsuarios,

                setUser,
                loginUserfn,
                logoutUserfn,
                movientosUsuariosfn
            }}
        >
            {props.children}
        </UserContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(UserContext)
}