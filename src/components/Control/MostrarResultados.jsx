import React, { useState, useMemo } from 'react';

import {
  Button,
  Card,
  Col,
  Dropdown,
  DropdownButton,
  Row,
} from 'react-bootstrap';
import { FiFolder } from 'react-icons/fi';
import {
  AiOutlineFile,
  AiOutlineFolderOpen,
  AiOutlineReload,
} from 'react-icons/ai';

import { RiArrowGoBackLine } from 'react-icons/ri';
import { useAppProvider } from '../../context/actasContext/AppProvider';
import { useAuth } from '../../context/userContext/UserProvider';
import Swal from 'sweetalert2/dist/sweetalert2.all.js';
import cliTruncate from "cli-truncate";



export const MostrarResultados = () => {
  const [refresh, setRefresh] = useState('');
  const [id, setId] = useState('');
  const { user } = useAuth();
  const {
    resultados,
    handleMostrar,
    mostrar,
    setVisualizar,
    eliminarFilefn,
    eliminarFolderfn,
    visualizar,
    descargarFilefn
  } = useAppProvider();

  const [saveFiles, setSaveFiles] = useState();
  
//
  const cambiarPerspectiva = (idx, tof) => {
    handleMostrar(tof);
    setVisualizar('');
    setSaveFiles(idx);
  };

  const volver = (tof) => {
    handleMostrar(tof);
    setVisualizar('');
  };

  const handleEliminarFile = (item, item2) => {
    console.log(item);
    console.log(item2);

    Swal.fire({
      title: 'Estas Seguro?',
      text: 'No seras capaz de revertir esto!',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        const infoNeeded = {
          public_id: item.public_id,
          _id: item2._id,
          tipo: item2.tipo,
        };
        eliminarFilefn(infoNeeded);
        Swal.fire('Eliminado!', 'Usuario Eliminado.', 'success');
      }
    });
  };

  const handleEliminarFolder = (info) => {
    Swal.fire({
      title: 'Estas Seguro?',
      text: 'No seras capaz de revertir esto!',
      icon: 'warning',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Eliminar!',
    }).then((result) => {
      if (result.isConfirmed) {
        eliminarFolderfn(info);

        Swal.fire('Eliminado!', 'Usuario Eliminado.', 'success');
      }
    });
  };

  const handleCargar = () => {
    setVisualizar('');
    setTimeout(() => {
      setVisualizar(refresh);
    }, 0);
  };

  //funcion para poder registrar cuando un usuario descargar un archivo
  const handleDescargar=(originalName, tipo, nombre)=>{
    // console.log(tipo);
    // console.log('en descargar',originalName)
    descargarFilefn({tipo,originalName,nombre})
  }

  useMemo(() => setRefresh(visualizar), [visualizar]);

  return (
    <Row className="mt-2">
      <hr />
      {mostrar === true && (
        <>
          {resultados?.map((item, idx) => (
            <Col md={2} key={item?._id}>
              <Card>
                <Card.Body>
                  <Card.Subtitle className="mb-2 text-muted d-flex align-items-center justify-content-between">
                    Files: {item?.files?.length}
                    {user?.role === 'admin' && (
                      <DropdownButton
                        variant="outline-secondary"
                        id="bg-nested-dropdown"
                        title=""
                      >
                        <Dropdown.Item
                          eventKey="1"
                          onClick={() => handleEliminarFolder(item)}
                        >
                          Eliminar
                        </Dropdown.Item>
                      </DropdownButton>
                    )}
                  </Card.Subtitle>
                  <FiFolder
                    onClick={() => cambiarPerspectiva(idx, false)}
                    style={{ fontSize: '140px' }}
                    className="w-100 pt-2 pb-2"
                  />
                  <Card.Title style={{ textAlign: 'center' }}>
                    {item?.nombre}
                  </Card.Title>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </>
      )}

      {mostrar === false && (
        <>
          <div>
            <div className="d-flex justify-content-between align-itemc">
              <Button variant="outline-secondary" onClick={() => volver(true)}>
                Volver <RiArrowGoBackLine />
              </Button>

              <AiOutlineReload
                onClick={handleCargar}
                style={{ fontSize: '30px', cursor: 'pointer' }}
              />
            </div>
            <h4 style={{ fontWeight: '300' }} className="mt-3">
              <AiOutlineFolderOpen /> Estas en {resultados[saveFiles]?.nombre}/
            </h4>
            <hr />
          </div>
          <div
            style={{
              maxHeight: '623px',
              height: 'calc(623px - 150px)',
              overflowY: 'scroll',
            }}
          >
            {resultados[saveFiles]?.files?.map((item, idx) => (
              <div
                key={item?.public_id + idx}
                onClick={() => {
                  setVisualizar(item?.secure_url),
                    handleMostrar(false),
                    setId(item?.public_id);
                }}
                className={`d-flex justify-content-between border pt-2 pb-2 list-box ${
                  item.public_id === id ? 'activeBox' : null
                }`}
                style={{ cursor: 'pointer' }}
              >
                <AiOutlineFile style={{ fontSize: '50px' }} />
                <div>
                  <p>{cliTruncate(item?.originalname, 40)}</p>
                </div>
                <DropdownButton
                  id="bg-nested-dropdown"
                  title=""
                  variant="outline-secondary"
                >
                  {user?.role === 'admin' && (
                    <Dropdown.Item
                      eventKey="1"
                      onClick={() =>
                        handleEliminarFile(item, resultados[saveFiles])
                      }
                    >
                      Eliminar
                    </Dropdown.Item>
                  )}
                  <Dropdown.Item
                    eventKey="2"
                    href={`${item.secure_url}`}
                    download
                    onClick={()=>handleDescargar(item.originalname, resultados[saveFiles].tipo, resultados[saveFiles].nombre)}
                  >
                    Descargar
                  </Dropdown.Item>
                </DropdownButton>
              </div>
            ))}
          </div>
        </>
      )}
    </Row>
  );
};
