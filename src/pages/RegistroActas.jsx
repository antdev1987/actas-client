import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';
import { useAppProvider } from '../context/actasContext/AppProvider';
import { FiFolder } from 'react-icons/fi';
import { useAuth } from '../context/userContext/UserProvider';

const RegistroActas = () => {
  const { user } = useAuth();

  const [mostrar, setMostrar] = useState({
    grupo1: false,
    guardar: false,
    usuario: '',
  });

  // files input
  const [saveFile, setSaveFile] = useState();

  //este obtiene el usuario buscado o creado
  const [userFolder, setUserFolder] = useState({});

  //este obtiene el valor del input para buscar o crear usuario (onchange)
  const [inputUsuario, setInputUsuario] = useState({
    nombre: '',
    selector: 'Entrega',
  });

  const {
    buscarFolderUsuariofn,
    resultados,
    filtrarbaseDeDatosActas,
    crearFolderUsuariofn,
    guardarArchivosRegistrofn,
  } = useAppProvider();

  const inputRef = useRef(); // seleciona el input file para limpiarlo luego de usuarlo
  const { addToast } = useToasts();

  //

  // esto se encargar de las notificaciones
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

  // este busca una carpeta en la pagina registro
  const handleBuscar = async (e) => {
    e.preventDefault();

    if (inputUsuario.nombre === '') {
      addToast('Esta vacio', { appearance: 'error', autoDismiss: true });

      setMostrar({ ...mostrar, grupo1: false, usuario: null });
      return;
    }

    // buscarFolderUsuariofn(setUserFolder, inputUsuario);
    filtrarbaseDeDatosActas(inputUsuario.selector, inputUsuario.nombre);
  };

  const archivoSelected = async (archivoInfo) => {
    console.log(archivoInfo);

    const info = {
      nombre: archivoInfo.nombre,
      selector: archivoInfo.tipo,
    };

    setInputUsuario(info);

    buscarFolderUsuariofn(setUserFolder, info);
  };

  //este se encargar de crear el folder
  const handlecrear = (e) => {
    e.preventDefault();

    if (inputUsuario.nombre === '') {
      addToast('Esta vacio', { appearance: 'error', autoDismiss: true });

      setMostrar({ ...mostrar, grupo1: false, usuario: null });
      return;
    }

    crearFolderUsuariofn(setUserFolder, inputUsuario);
  };

  // este se encargar de almacenar los archivos en un state y asi aparece el boton de gardar
  const handleFiles = (e) => {
    setSaveFile(e.target.files);
    console.log(e.target.files);

    if (e.target.files.length === 0) {
      setMostrar({ ...mostrar, guardar: false });
      return;
    }

    setMostrar({ ...mostrar, guardar: true });
  };

  // envia los archivos al backend
  const handleGuardar = async (e) => {
    e.preventDefault();

    if (saveFile.length === 0) return;

    const data = new FormData();

    for (var x = 0; x < saveFile.length; x++) {
      console.log(saveFile[x]);
      data.append(`myFiles`, saveFile[x]);
    }

    data.append('selector', inputUsuario.selector);

    inputRef.current.value = null;
    setSaveFile([]);
    setMostrar({ ...mostrar, guardar: false });
    guardarArchivosRegistrofn(data, userFolder._id);
  };

  return (
    <>
      {' '}
      <div
        style={{
          maxWidth: '900px',
          margin: '50px auto',
          display: 'flex',
          alignItems: 'center',
          maxHeight: '9999999999px',
        }}
      >
        <Form style={{ width: '100%' }} onSubmit={(e) => e.preventDefault()}>
          <h2 className="text-center">Registros de Actas</h2>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Tipo de acta</Form.Label>
            <Form.Select
              name="selector"
              onChange={(e) =>
                setInputUsuario({
                  ...inputUsuario,
                  [e.target.name]: e.target.value,
                })
              }
            >
              <option value="Entrega">Entrega</option>
              <option value="Devolucion">Devolucion</option>
              <option value="PlanMantenimiento">Plan de mantenimiento</option>
            </Form.Select>
            <hr />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Nombre del usuario: </Form.Label>
            <Form.Control
              onChange={(e) =>
                setInputUsuario({
                  ...inputUsuario,
                  [e.target.name]: e.target.value,
                })
              }
              name="nombre"
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
              <Form.Group className="mb-3">
                <Form.Label>Browser</Form.Label>
                <Form.Control
                  ref={inputRef}
                  type="file"
                  multiple
                  onChange={handleFiles}
                  accept=".doc,.DOCX,.xlsx,.pdf"
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
      <div className="gridCustom">
        {resultados?.map((item, idx) => (
          <Card key={item?._id}>
            <Card.Body>
              <Card.Subtitle className="mb-2 text-muted d-flex align-items-center justify-content-between">
                Files: {item?.files?.length}
              </Card.Subtitle>
              <FiFolder
                style={{ fontSize: '140px' }}
                className="w-100 pt-2 pb-2"
                onClick={() => archivoSelected(item)}
              />
              <Card.Title style={{ textAlign: 'center' }}>
                {item?.nombre}
              </Card.Title>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default RegistroActas;
