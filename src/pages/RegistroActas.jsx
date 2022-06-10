import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useAppProvider } from '../context/actasContext/AppProvider';

const RegistroActas = () => {
  //const [mostrar, setMostrar] = useState({ grupo1: false, grupo2: false });
  const [mostrar, setMostrar] = useState({ grupo1: false, grupo2: false });
  const {buscarFolderUsuariofn,crearFolderUsuariofn } = useAppProvider()

  //este obtiene el usuario buscado o creado
  const [userFolder,setUserFolder]= useState({})

  //este obtiene el valor del input para buscar o crear usuario (onchange)
  const [inputUsuario,setInputUsuario] = useState({})



  const handleBuscar = (e) => {
    e.preventDefault();
    setMostrar({ ...mostrar, grupo1: true });

    //validacion

    buscarFolderUsuariofn(setUserFolder,inputUsuario)

  };

  console.log(userFolder,'testing')

  const handlecrear = (e) => {
    e.preventDefault();
    crearFolderUsuariofn(setUserFolder,inputUsuario)
    console.log(mostrar);
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
      <Form style={{ width: '100%' }}>
        <h2 className="text-center">Registros de Actas</h2>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label>Nombre del usuario: </Form.Label>
          <Form.Control onChange={e=>setInputUsuario({nombre:e.target.value})} type="text" placeholder="Ingrese nombre" />

          <div className="d-flex gap-2 mt-3">
            <Button variant="outline-primary" onClick={handleBuscar}>
              Buscar
            </Button>
            <Button variant="outline-primary" onClick={handlecrear}>
              Crear
            </Button>
          </div>

          {/* <Form.Text className="text-muted">
            We'll never share your email with anyone else.
          </Form.Text> */}
        </Form.Group>

        {mostrar.grupo1 && (
          <>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Tipo de acta</Form.Label>
              <Form.Select aria-label="Default select example">
                <option>Open this select menu</option>
                <option value="1">One</option>
                <option value="2">Two</option>
                <option value="3">Three</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className='mb-3'>
              <Form.Label>Browser</Form.Label>
              <Form.Control type="file" multiple />
            </Form.Group>

            <Button variant="primary" type="submit">
              Guardar
            </Button>
          </>
        )}
      </Form>
    </div>
  );
};

export default RegistroActas;
