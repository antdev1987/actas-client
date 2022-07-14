import axios from 'axios'

import { createContext, useContext, useState } from 'react'

import { useNavigate } from 'react-router-dom'


const UserContext = createContext()

export const UserProvider = props => {

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('uid')) || '')
  const [isUserActiveLoading, setIsUserActiveLoading] = useState(false)
  const [movientosUsuarios, setMovimientosUsuarios] = useState([])



  const navigate = useNavigate()


  const loginUserfn = async (userData, setError) => {

    try {
      setIsUserActiveLoading(true)
      const endPoint = `${import.meta.env.VITE_URL}/user/login`
      const { data } = await axios.post(endPoint, userData)

      localStorage.setItem('uid', JSON.stringify(data));
      setIsUserActiveLoading(false)
      setUser(data)
    } catch (error) {

      console.log(error.response.data.msg)
      setError(error.response.data.msg)
      setIsUserActiveLoading(false)
    }
  }


  const movientosUsuariosfn = async () => {

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
      const endPoint = `${import.meta.env.VITE_URL}/user/movimientos-usuarios`
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