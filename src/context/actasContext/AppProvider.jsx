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

const AppContext = createContext();

/////////////aqui comienzan las funciones para el context//
export const AppProvider = (props) => {

  const { addToast } = useToasts();
  const [state, dispatch] = useReducer(AppReducer, InitialState);
  const [mostrar, setMostrar] = useState('');
  const [visualizar, setVisualizar] = useState('');
  const [isActiveLoading, setIsActiveLoading] = useState(false);
  const { setUser } = useAuth();


  //esto carga la base de datos actas una vez logeado
  useEffect(() => {
    baseDeDatosActas();
  }, [state.baseDatosActas?.status, state.baseDatosActas?.length]);

  /////////////////// funciones para trabajar en el reducer ////////

  //administra para mostar los resultados en la busqueda de folder en la pagina control
  const handleMostrar = (payload) => {
    setMostrar(payload);
  };


  //esto se encarga de manegar los state de usuarios de la pagina Admin users
  const setUserBd = (userBd) => {
    dispatch({ type: 'GUARDAR-USERBD', payload: userBd });
  };
  const setOneUserBd = (oneUserBd) => {
    dispatch({ type: 'UPDATE-ONE-USER', payload: oneUserBd });
  };
  const updatingLocaluserBd = (id) => {
    dispatch({ type: 'DELETE-LOCAL-USER', payload: id });
  };



  //este se encargar de los state de control para poder hacer filtros en la busqueda en la pagina control
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



  //este se encargar de administrar los state del calendario
  const setEventosBd = (payload) => {
    dispatch({ type: 'GUARDAR-EVENTO', payload })
  }
  const setOneEventBd = (oneEventBd) => {
    dispatch({ type: 'ADD-ONE-EVENT', payload: oneEventBd });
  };
  const eliminarLocalEvent = (id) => {
    dispatch({ type: 'DELETE-LOCAL-EVENT', payload: id });
  };



  //este se encarga de los state del sidebar en plan mantenimiento
  const setObtenerAdminFiles = (adminFilesBd) => {
    dispatch({ type: 'OBTENER-ADMIN-BD', payload: adminFilesBd })
  }
  const eliminarAdminFileLocaL = (payload) => {
    dispatch({ type: 'ELIMINAR-ADMIN-FILE-LOCAL', payload });
  }

  //obtiene las base de datos actas entrega, devolucion y plan mantenimiento para luego poder filtrar en control
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
      const endPoint = `${import.meta.env.VITE_URL}/actas/obtener-bds`;
      const { data } = await axios.get(endPoint, config);

      setBaseDatosActas(data);
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };


  //funcion que obtine ultimos datos de base de datos para poder filtrar busqueda en react 
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
      const endPoint = `${import.meta.env.VITE_URL}/actas/obtener-bds`;

      const { data } = await axios.get(endPoint, config);

      const filtrado = data[selector].filter((item) => {
        const nombreBD = accent_fold(item.nombre.toLowerCase());
        const name = accent_fold(nombre.toLowerCase());
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
      setIsActiveLoading(true);
      const endPoint = `${import.meta.env.VITE_URL}/user/crear-usuario`;
      const { data } = await axios.post(endPoint, userData, config);

      console.log(data);

      setOneUserBd(data);
      setIsActiveLoading(false);
    } catch (error) {
      console.log(error.response.data.msg);
      setIsActiveLoading(false);
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
      const endPoint = `${import.meta.env.VITE_URL}/user/eliminar-usuario/${id}`;
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
      const endPoint = `${import.meta.env.VITE_URL}/actas/crear-folder`;
      const { data } = await axios.post(endPoint, inputUsuario, config);
      recargarBaseDeDatos();
      setUserFolder(data);
      console.log(data, 'funtion crearfolderfn');
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  //este codigo sirve para almacenar los archivos docx xlsx pdf en un usuario especifico
  const guardarArchivosRegistrofn = async (setData, id) => {
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
      const endPoint = `${import.meta.env.VITE_URL}/actas/guardar-archivos/${id}`;
      setIsActiveLoading(true);
      const { data } = await axios.post(endPoint, setData, config);
      setIsActiveLoading(false);
      recargarBaseDeDatos();
      addToast('Enviado', { appearance: 'success', autoDismiss: true });
      console.log(data, 'funtion asdfafsdafds');
    } catch (error) {
      console.log(error.response.data.msg);
      setIsActiveLoading(false);
    }
  };

  //con este codigo podra buscar si existe un usuario en la base de datos en la pagina registro
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
      const endPoint = `${import.meta.env.VITE_URL}/actas/buscar-folder`;
      const { data } = await axios.post(endPoint, inputUsuario, config);
      recargarBaseDeDatos();
      setUserFolder(data);
      console.log(data, 'funtion buscarfolderfn');
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };

  //este es para eliminar un archivo en la pagina control
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
      const endPoint = `${import.meta.env.VITE_URL}/actas/eliminar-un-archivo`;
      const { msg } = await axios.delete(endPoint, config);
      recargarBaseDeDatos();
      console.log(msg, 'funtion buscarfolderfn');
    } catch (error) {
      console.log(error.response.data.msg);
    }
  };


  //esta llamado solo sirve para llevar el control de cuando un usuario descargar un archivo
  const descargarFilefn = async (info) => {
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
        ...info
      },
    };
    console.log(config)
    try {

      const endPoint = `${import.meta.env.VITE_URL}/actas/descargar-un-archivo`;
      const { data } = await axios.get(endPoint, config);
      // recargarBaseDeDatos();
      console.log(data, 'funtion descargar file');
    } catch (error) {
      console.log(error.response);
    }
  };


  //este eliminar el folder en la pagina control
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
      const endPoint = `${import.meta.env.VITE_URL}/actas/eliminar-folder`;

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


  ///////////////eventos funciones pagina plan mantenimiento

  //funcion para crear un nuevo evento
  const agregarOEditarEventofn = async (inputUsuario) => {


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
      const endPoint = `${import.meta.env.VITE_URL}/actas/agregar-o-editar-evento`;
      const { data } = await axios.post(endPoint, inputUsuario, config);

      setOneEventBd(data)

      console.log(data, 'evento agregado');
    } catch (error) {
      console.log(error.response.data.msg);
    }

  }

  //funcion para obtener los eventos

  const obtenerEventosfn = async () => {

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
      const endPoint = `${import.meta.env.VITE_URL}/actas/obtener-eventos`;
      const { data } = await axios.get(endPoint, config);

      setEventosBd(data)

      // console.log(data, 'los eventos');
    } catch (error) {
      console.log(error.response.data.msg);
    }

  }


  //funcion para eliminar un evento
  const eliminarEventofn = async (id) => {
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
      const endPoint = `${import.meta.env.VITE_URL}/actas/eliminar-evento/${id}`;
      const { data } = await axios.delete(endPoint, config);
      eliminarLocalEvent(id)
      console.log(data, 'los eventos');
    } catch (error) {
      console.log(error.response.data.msg);
    }

  }


  //sidebar obtener los admin files

  const obtenerAdminFilesfn = async () => {

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
      const endPoint = `${import.meta.env.VITE_URL}/actas/obtener-archivos-admin`;
      const { data } = await axios.get(endPoint, config);

      setObtenerAdminFiles(data)
    } catch (error) {
      console.log(error.response.data.msg)
    }

  }

  //este es para eliminar un archivo subido en el folder admin
  const eliminarAdminFilefn = async (info) => {

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
        public_id: info.public_id,
      },
    };
    try {
      const endPoint = `${import.meta.env.VITE_URL}/actas/eliminar-archivo-admin`;
      const { data } = await axios.delete(endPoint, config);
      // recargarBaseDeDatos();
      eliminarAdminFileLocaL(info);
      console.log(data, 'funcion eliminar archivo admin');
    } catch (error) {
      console.log(error.response.data.msg);
    }

  }

  // Para subir files en el sidebar 
  const subirFilesAdminfn = async (files) => {
    console.log(files)
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
      const endPoint = `${import.meta.env.VITE_URL}/actas/guardar-archivos-admin`;
      setIsActiveLoading(true);
      const { data } = await axios.post(endPoint, files, config);

      addToast('Guardado', { appearance: 'success', autoDismiss: true });
      obtenerAdminFilesfn()
      setIsActiveLoading(false);
    } catch (error) {
      addToast(error.response.data.msg, { appearance: 'warning', autoDismiss: true });
      setIsActiveLoading(false);
    }
  }

  return (
    <AppContext.Provider
      value={{
        userBd: state.userBd,

        setUserBd,
        baseDatosActas: state.baseDatosActas,
        resultados: state.resultados,
        mostrar,
        isActiveLoading: isActiveLoading,

        createNewUserAppfn,
        deleteNewUserAppfn,
        buscarFolderUsuariofn,
        crearFolderUsuariofn,
        guardarArchivosRegistrofn,
        guardarResultados,
        handleMostrar,
        visualizar,
        setVisualizar,
        eliminarFilefn,
        recargarBaseDeDatos,
        filtrarbaseDeDatosActas,
        eliminarFolderfn,
        setIsActiveLoading,
        descargarFilefn,

        //funciones de eventos pagina plan mantenimiento
        eventosBd: state.eventosBd,
        adminFilesBd: state.adminFilesBd,
        agregarOEditarEventofn,
        obtenerEventosfn,
        setOneEventBd,
        eliminarEventofn,
        obtenerAdminFilesfn,
        eliminarAdminFilefn,
        subirFilesAdminfn

      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};

export const useAppProvider = () => {
  return useContext(AppContext);
};
