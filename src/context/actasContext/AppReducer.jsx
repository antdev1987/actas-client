export const InitialState ={
    userBd:[],
    baseDatosActas: {},
    resultados: []
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

        default:{
            return {...state}
        }
    }

}