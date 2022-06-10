import axios from 'axios'

import {createContext,useContext, useEffect, useReducer,useState} from 'react'
import { AppReducer, InitialState } from './AppReducer'

import { useAuth } from '../userContext/UserProvider'

const AppContext = createContext()

export const AppProvider = props =>{

    const [state,dispatch] =useReducer(AppReducer,InitialState)
    const {user,SetUser} = useAuth()

    /////////////////// funciones para trabajar en el reducer ////////

    const setUserBd = (userBd)=>{
        dispatch({type:'GUARDAR-USERBD',payload:userBd})
    }

    const setOneUserBd = (oneUserBd)=>{
        dispatch({type:'UPDATE-ONE-USER',payload:oneUserBd})
    } 

    const updatingLocaluserBd = (id)=>{
        console.log(typeof id)
        dispatch({type:'DELETE-LOCAL-USER',payload:id})
    }



    /////// funciones generales ////////

    const createNewUserAppfn = async(userData)=>{

        const token = JSON.parse(localStorage.getItem('uid'))
        if(!token){
            setUserBd('')
            return
        }
        const config={
            headers:{
                Authorization:`Bearer ${token.token}`
            }
        }

        try {

            const endPoint = `${import.meta.env.VITE_BASE_URL}/user/crear-usuario`
            const {data} = await axios.post(endPoint,userData,config)

            console.log(data)
            
            setOneUserBd(data)
        } catch (error) {
            console.log(error.response.data.msg)
        }
    }


    const deleteNewUserAppfn = async(id)=>{
        console.log(id)
        const token = JSON.parse(localStorage.getItem('uid'))
        if(!token){
            setUser('')
            return
        }
        const config = {
            headers:{
                Authorization:`Bearer ${token.token}`
            }
        }
        try {
            const endPoint = `${import.meta.env.VITE_BASE_URL}/user/eliminar-usuario/${id}`
            const {data} = await axios.delete(endPoint,config)
            updatingLocaluserBd(id)
            console.log(data)

        } catch (error) {
            console.log(error.response)
        }
    }



    return(
        <AppContext.Provider
            value={{

                userBd:state.userBd,

                setUserBd,

                createNewUserAppfn,
                deleteNewUserAppfn

            }}
        >
            {props.children}
        </AppContext.Provider>
    )
}

export const useAppProvider =()=>{
    return useContext(AppContext)
}