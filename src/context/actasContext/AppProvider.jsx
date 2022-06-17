import axios from 'axios';

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from 'react';
import { AppReducer, InitialState } from './AppReducer';

import { useAuth } from '../userContext/UserProvider';
import { useToasts } from 'react-toast-notifications';

const AppContext = createContext({
  crearFolderUsuariofn: () => {},
  guardarFolderUsuariofn: () => {},
  baseDatosActas: [],
  guardarResultados: (payload) => {},
});

export const AppProvider = (props) => {
  // const [baseDatosActas, setBaseDatosActas] = useState({})
  const { addToast } = useToasts();


  const [state, dispatch] = useReducer(AppReducer, InitialState);

  const [mostrar, setMostrar] = useState('');
  const [visualizar, setVisualizar] = useState(false);
  const [isActiveLoading, setIsActiveLoading] = useState(false)



  const { user, setUser } = useAuth();

  useEffect(() => {
    baseDeDatosActas();
    console.log('test');
  }, [state.baseDatosActas?.status, state.baseDatosActas?.length]);

  /////////////////// funciones para trabajar en el reducer ////////

  const handleMostrar = (payload) => {
    setMostrar(payload);
  };

  const setUserBd = (userBd) => {
    dispatch({ type: 'GUARDAR-USERBD', payload: userBd });
  };

  const setOneUserBd = (oneUserBd) => {
    dispatch({ type: 'UPDATE-ONE-USER', payload: oneUserBd });
  };

  const updatingLocaluserBd = (id) => {
    console.log(typeof id);
    dispatch({ type: 'DELETE-LOCAL-USER', payload: id });
  };

  const setBaseDatosActas = (payload) => {
    dispatch({ type: 'GUARDAR-BD', payload });
  };

  const guardarResultados = (payload) => {
    dispatch({ type: 'GUARDAR-RESULTADOS', payload });
  };

  const eliminarResultados = (payload) => {
    dispatch({ type: 'ELIMINAR-RESULTADOS', payload });
  };
  /////// funciones generales ////////

  const recargarBaseDeDatos = () => {
    setBaseDatosActas({ status: 'recargar' });
    return 'recargado';
  };

  // const dynamicurlLocal = 'http://192.168.100.7:4000/';
  const dynamicurlLocal = 'https://actas-server.herokuapp.com/';
  //https://actas-server.herokuapp.com

  //
  const baseDeDatosActas = async () => {
    const token = JSON.parse(localStorage.getItem('uid'));
    if (!token) {
      setUserBd('');
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    };

    try {
      if (state.baseDatosActas.entrega) return;
      const endPoint = `${dynamicurlLocal}api/actas/obtener-bds`;
      const { data } = await axios.get(endPoint, config);

      console.log(data, 'base de datos');
      setBaseDatosActas(data);
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };



  //funcion que obtiner ultimos datos de base de datos para poder filtrar busqueda en react
  const filtrarbaseDeDatosActas = async (selector, nombre) => {
    console.log(selector, nombre);

    var accent_map = {
      á: 'a',
      é: 'e',
      í: 'i',
      ó: 'o',
      ú: 'u',
      Á: 'a',
      É: 'e',
      è: 'e',
      Í: 'i',
      Ó: 'o',
      Ú: 'u',
    };
    function accent_fold(s) {
      if (!s) {
        return '';
      }
      var ret = '';
      for (var i = 0; i < s.length; i++) {
        ret += accent_map[s.charAt(i)] || s.charAt(i);
      }
      return ret;
    }

    const token = JSON.parse(localStorage.getItem('uid'));
    if (!token) {
      setUserBd('');
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    };

    try {
      const endPoint = `${dynamicurlLocal}api/actas/obtener-bds`;

      const { data } = await axios.get(endPoint, config);

      const filtrado = data[selector].filter((item) => {
        const nombreBD = accent_fold(item.nombre.toLowerCase())
        const name = accent_fold(nombre.toLowerCase())
        return nombreBD.includes(name);
      });

      guardarResultados(filtrado);

      if (filtrado.length !== 0) return;
      addToast(`No hubo resultados`, {
        appearance: 'error',
        autoDismiss: true,
      });

      console.log(filtrado, 'base de datos');
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };


  //esta funcion sirve para que el administrador pueda crear un nuevo usuario para acceder a la aplicacion
  const createNewUserAppfn = async (userData) => {
    const token = JSON.parse(localStorage.getItem('uid'));
    if (!token) {
      setUserBd('');
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
    };
    try {
      setIsActiveLoading(true)
      const endPoint = `${dynamicurlLocal}api/user/crear-usuario`;
      const { data } = await axios.post(endPoint, userData, config);

      console.log(data);

      setOneUserBd(data);
      setIsActiveLoading(false)
    } catch (error) {
      console.log(error.response.data.msg);
      setIsActiveLoading(false)
    }
  };


  //este codigo sirve para poder eliminar un usuario ya creado
  const deleteNewUserAppfn = async (id) => {
    console.log(id);
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
      const endPoint = `${dynamicurlLocal}api/user/eliminar-usuario/${id}`;
      const { data } = await axios.delete(endPoint, config);
      updatingLocaluserBd(id);
      console.log(data);
    } catch (error) {
      console.log(error.response);
    }
  };


  ///////////// codigo de creacion de usario de folder en adelante

  //este codigo sirve para crear un nombre de usuario para alamacenar archivos docx xlsx pdf
  const crearFolderUsuariofn = async (setUserFolder, inputUsuario) => {
    console.log(inputUsuario);

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
      const endPoint = `${dynamicurlLocal}api/actas/crear-folder`;
      const { data } = await axios.post(endPoint, inputUsuario, config);
      recargarBaseDeDatos();
      setUserFolder(data);
      console.log(data, 'funtion crearfolderfn');
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  //este codigo sirve para almacenar los archivos docx xlsx pdf en un usuario especifico
  const guardarFolderUsuariofn = async (setData, id) => {
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
      const endPoint = `${dynamicurlLocal}api/actas/guardar-archivos/${id}`;
      const { data } = await axios.post(endPoint, setData, config);
      recargarBaseDeDatos();
      console.log(data, 'funtion asdfafsdafds');
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  //con este codigo podra buscar si existe un usuario en la base de datos
  const buscarFolderUsuariofn = async (setUserFolder, inputUsuario) => {
    console.log(inputUsuario);

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
      const endPoint = `${dynamicurlLocal}api/actas/buscar-folder`;
      const { data } = await axios.post(endPoint, inputUsuario, config);
      recargarBaseDeDatos();
      setUserFolder(data);
      console.log(data, 'funtion buscarfolderfn');
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  const eliminarFilefn = async (info) => {
    console.log(info);

    const token = JSON.parse(localStorage.getItem('uid'));
    if (!token) {
      setUser('');
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
      params: {
        id: info._id,
        selector: info.tipo,
        public_id: info.public_id,
      },
    };
    try {
      const testFiltrado2 = state.resultados.map((item) => {
        if (item._id === info._id) {
          return {
            ...item,
            files: item.files.filter((e) => e.public_id !== info.public_id),
          };
        } else {
          return item;
        }
      });
      console.log(testFiltrado2);
      eliminarResultados(testFiltrado2);
      const endPoint = `${dynamicurlLocal}api/actas/eliminar-un-archivo`;
      const { msg } = await axios.delete(endPoint, config);
      recargarBaseDeDatos();
      console.log(msg, 'funtion buscarfolderfn');
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  const eliminarFolderfn = async (info) => {
    console.log(info);

    const token = JSON.parse(localStorage.getItem('uid'));
    if (!token) {
      setUser('');
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token.token}`,
      },
      params: {
        id: info._id,
        selector: info.tipo,
      },
    };
    try {
      const endPoint = `${dynamicurlLocal}api/actas/eliminar-folder`;

      const { data } = await axios.delete(endPoint, config);

      const testFiltrado2 = state.resultados.filter(
        (item) => item._id !== info._id
      );
      console.log(testFiltrado2);

      eliminarResultados(testFiltrado2);

      console.log(data, 'funtion buscarfolderfn');
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  return (
    <AppContext.Provider
      value={{
        userBd: state.userBd,

        setUserBd,
        baseDatosActas: state.baseDatosActas,
        resultados: state.resultados,
        mostrar,
        isActiveLoading:isActiveLoading,

        createNewUserAppfn,
        deleteNewUserAppfn,
        buscarFolderUsuariofn,
        crearFolderUsuariofn,
        guardarFolderUsuariofn,
        guardarResultados,
        handleMostrar,
        visualizar,
        setVisualizar,
        eliminarFilefn,
        recargarBaseDeDatos,
        filtrarbaseDeDatosActas,
        eliminarFolderfn,
        setIsActiveLoading
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppProvider = () => {
  return useContext(AppContext);
};
