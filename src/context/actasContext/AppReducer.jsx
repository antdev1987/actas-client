export const InitialState ={
    userBd:[],
    baseDatosActas: {},
    resultados: [],
    eventosBd:[],
    adminFilesBd:[]
}

export const AppReducer = (state,action)=>{

    switch(action.type){
        case 'GUARDAR-USERBD':{
            return{
                ...state,
                userBd:[...action.payload]
            }
        }

        case 'UPDATE-ONE-USER':{
            return {
                ...state,
                userBd:[...state.userBd,action.payload]
            }
        }

        case 'DELETE-LOCAL-USER':{
            console.log(state.userBd)
            return {
                ...state,
                userBd:state.userBd.filter(item=> item._id.toString() !== action.payload)
            }
        }

        case  "GUARDAR-BD" : {
            return {
                ...state, 
                baseDatosActas: action.payload
            }
        }

        case "GUARDAR-RESULTADOS" : {
            return {
                ...state,
                resultados: action.payload
            }
        }

        case "ELIMINAR-RESULTADOS" : {
            return {
                ...state, 
                resultados: action.payload
            }
        }

        case 'GUARDAR-EVENTO':{
            return{
                ...state,
                eventosBd:[...action.payload]
            }
        }

        case 'ADD-ONE-EVENT':{
            return{
                ...state,
                eventosBd:[...state.eventosBd, action.payload]
            }
        }

        case 'DELETE-LOCAL-EVENT':{
            console.log(state.userBd)
            return {
                ...state,
                eventosBd:state.eventosBd.filter(item=> item._id.toString() !== action.payload)
            }
        }

        case 'OBTENER-ADMIN-BD':{
            return{
                ...state,
                adminFilesBd:[...action.payload]
            }
        }

        case "ELIMINAR-ADMIN-FILE-LOCAL" : {
            console.log(state.payload)
            return {
                ...state, 
                adminFilesBd: state.adminFilesBd.filter(item=> item._id !== action.payload._id)
            }
        }

        default:{
            return {...state}
        }
    }

}