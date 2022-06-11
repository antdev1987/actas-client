import React, { useEffect, useRef, useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import { useAppProvider } from '../context/actasContext/AppProvider';

const RegistroActas = () => {
  const inputRef = useRef();

  const { addToast } = useToasts();

  const [mostrar, setMostrar] = useState({
    grupo1: false,
    guardar: false,
    usuario: '',
  });

  // files input
  const [saveFile, setSaveFile] = useState();

  // Select input
  const [saveSelect, setSaveSelect] = useState({ selector: 'entrega' });

  const {
    buscarFolderUsuariofn,
    crearFolderUsuariofn,
    guardarFolderUsuariofn,
  } = useAppProvider();

  //este obtiene el usuario buscado o creado
  const [userFolder, setUserFolder] = useState({});

  //este obtiene el valor del input para buscar o crear usuario (onchange)
  const [inputUsuario, setInputUsuario] = useState('');

  // Validacion
  useEffect(() => {
    if (userFolder.msg) {
      addToast(userFolder.msg, { appearance: 'error', autoDismiss: true });

      setMostrar({ ...mostrar, grupo1: false });
      return;
    }

    if (userFolder.nombre) {
      setMostrar({ ...mostrar, grupo1: true, usuario: userFolder.nombre });

      addToast(`El usuario ${userFolder.nombre} fue encontrado`, {
        appearance: 'success',
        autoDismiss: true,
      });
    }
  }, [userFolder]);

  // Boton buscar
  const handleBuscar = async (e) => {
    e.preventDefault();

    if (inputUsuario === '' || inputUsuario.nombre === '') {
      addToast('Esta vacio', { appearance: 'error', autoDismiss: true });

      setMostrar({ ...mostrar, grupo1: false, usuario: null });
      return;
    } else if (inputUsuario.nombre.includes(' ')) {
      addToast('No se Aceptan espacios', {
        appearance: 'error',
        autoDismiss: true,
      });

      return;
    }

    buscarFolderUsuariofn(setUserFolder, inputUsuario);
  };

  //Boton Crear
  const handlecrear = (e) => {
    e.preventDefault();

    if (inputUsuario === '' || inputUsuario.nombre === '') {
      addToast('Esta vacio', { appearance: 'error', autoDismiss: true });

      setMostrar({ ...mostrar, grupo1: false });
      return;
    } else if (inputUsuario.nombre.includes(' ')) {
      addToast('No se Aceptan espacios', {
        appearance: 'error',
        autoDismiss: true,
      });

      return;
    }

    crearFolderUsuariofn(setUserFolder, inputUsuario);
  };

  // Files
  const handleFiles = (e) => {
    setSaveFile(e.target.files);

    if (e.target.files.length === 0) {
      setMostrar({ ...mostrar, guardar: false });
      return;
    }

    setMostrar({ ...mostrar, guardar: true });
  };

  // input select
  const handleSelect = (e) => {
    setSaveSelect({ selector: e.target.value });
  };

  // Enviar la informacion
  const handleGuardar = async (e) => {
    e.preventDefault();

    if (saveFile.length === 0) return;

    const data = new FormData();

    for (var x = 0; x < saveFile.length; x++) {
      data.append(`myFiles`, saveFile[x]);
    }

    data.append('selector', saveSelect.selector);

    addToast('Enviado', { appearance: 'success', autoDismiss: true });
    inputRef.current.value = null;
    setSaveFile([]);
    setMostrar({ ...mostrar, guardar: false });
    guardarFolderUsuariofn(data, userFolder._id);
  };

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '0 auto',
        height: 'calc(100vh - 60px)',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Form style={{ width: '100%' }} onSubmit={(e) => e.preventDefault()}>
        <h2 className="text-center">Registros de Actas</h2>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Nombre del usuario: </Form.Label>
          <Form.Control
            onChange={(e) => setInputUsuario({ nombre: e.target.value })}
            type="text"
            placeholder="Ingrese nombre"
          />

          <div className="d-flex gap-2 mt-3 mb-3">
            <Button variant="outline-primary" onClick={handleBuscar}>
              Buscar
            </Button>
            <Button variant="outline-primary" onClick={handlecrear}>
              Crear
            </Button>
          </div>

          {mostrar.usuario && (
            <Form.Text className="text-success">
              Se encuentra en el archivo: {mostrar.usuario}
            </Form.Text>
          )}

          <hr />
        </Form.Group>

        {mostrar.grupo1 && (
          <>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Tipo de acta</Form.Label>
              <Form.Select onChange={handleSelect}>
                <option value="entrega">Entrega</option>
                <option value="devolucion">Devolucion</option>
                <option value="calendario">Calendario</option>
              </Form.Select>
              <hr />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Browser</Form.Label>
              <Form.Control
                ref={inputRef}
                type="file"
                multiple
                onChange={handleFiles}
              />

              <hr />
            </Form.Group>

            {mostrar.guardar && (
              <Button variant="primary" type="submit" onClick={handleGuardar}>
                Guardar
              </Button>
            )}
          </>
        )}
      </Form>
    </div>
  );
};

export default RegistroActas;
