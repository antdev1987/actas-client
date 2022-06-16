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

const AppContext = createContext({
  crearFolderUsuariofn: () => {},
  guardarFolderUsuariofn: () => {},
  baseDatosActas: [],
  guardarResultados: (payload) => {},
});

export const AppProvider = (props) => {
  // const [baseDatosActas, setBaseDatosActas] = useState({})

  const [state, dispatch] = useReducer(AppReducer, InitialState);

  const [mostrar, setMostrar] = useState('');

  const [visualizar, setVisualizar] = useState(false);

  const { user, setUser } = useAuth();

  useEffect(() => {
    baseDeDatosActas();
    console.log('test');
  }, [state.baseDatosActas?.status]);

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

  const dynamicurlLocal = 'http://192.168.100.7:4000/';
  //https://actas-server.herokuapp.com

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
      const endPoint = `${dynamicurlLocal}api/user/crear-usuario`;
      const { data } = await axios.post(endPoint, userData, config);

      console.log(data);

      setOneUserBd(data);
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

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
      setUserFolder(data);
      setBaseDatosActas({ status: 'recargar' });
      console.log(data, 'funtion crearfolderfn');
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

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
      setBaseDatosActas({ status: 'recargar' });
      console.log(data, 'funtion asdfafsdafds');
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

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
      const testFiltrado2 = state.resultados.find(item => item._id === info._id)
      // const testFiltrado = state.resultados.filter(item => item.files.public_id !== info.public_id)
      const testFiltrado = testFiltrado2.files.filter(item => item.public_id !== info.public_id)
      console.log(testFiltrado);
      eliminarResultados(testFiltrado)
      return
      const endPoint = `${dynamicurlLocal}api/actas/eliminar-un-archivo`;
      const { msg } = await axios.delete(endPoint, config);
      setBaseDatosActas({ status: 'recargar' });
      console.log(msg, 'funtion buscarfolderfn');
      eliminarResultados(info._id)
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
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppProvider = () => {
  return useContext(AppContext);
};
