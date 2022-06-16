import React, { useState } from 'react';

import {
  Button,
  Card,
  Col,
  Dropdown,
  DropdownButton,
  Row,
} from 'react-bootstrap';

import { FcFolder } from 'react-icons/fc';

import { AiOutlineFile } from 'react-icons/ai';

import { useAppProvider } from '../../context/actasContext/AppProvider';

export const MostrarResultados = () => {
  const { resultados, handleMostrar, mostrar, setVisualizar, eliminarFilefn } =
    useAppProvider();

  const [saveFiles, setSaveFiles] = useState();

  const cambiarPerspectiva = (idx, tof) => {
    // const { files, _id, tipo } = info;

    // files.map((e) => {
    //   e._id = _id;
    //   e.tipo = tipo;
    // });
+
    handleMostrar(tof);
    setVisualizar(false);
    setSaveFiles(idx);
  };

  const volver = (tof) => {
    handleMostrar(tof);
  };

  const eliminar = (item, item2) => {
    console.log(item);
    console.log(item2);

    const infoNeeded = {
      public_id: item.public_id,
      _id: item2._id,
      tipo: item2.tipo
    }
    eliminarFilefn(infoNeeded);
  };

  return (
    <Row className="mt-2">
      {resultados.length !== 0 && mostrar === true && (
        <>
          {resultados.map((item, idx) => (
            <Col md={3} key={item._id}>
              <Card
                className="mt-5"
                onClick={() => cambiarPerspectiva(idx, false)}
              >
                <Card.Body>
                  <Card.Title>{item.nombre}</Card.Title>
                  <FcFolder style={{ fontSize: '150px' }} className="w-100" />
                  <Card.Subtitle className="mb-2 text-muted">
                    Files: {item.files.length}
                  </Card.Subtitle>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </>
      )}

      {mostrar === false && (
        <>
          <div>
            <Button onClick={() => volver(true)}>Volver</Button>
          </div>
          <>
            {resultados[saveFiles].files.map((item) => (
              <Col
                md={4}
                key={item.public_id}
                onClick={() => setVisualizar(item.secure_url)}
              >
                <Card className="mt-5">
                  <Card.Body>
                    <Card.Title className="d-flex align-items-center justify-content-between">
                      {item.originalname}{' '}
                      <DropdownButton id="bg-nested-dropdown">
                        <Dropdown.Item
                          eventKey="1"
                          onClick={() => eliminar(item, resultados[saveFiles])}
                        >
                          funciona
                        </Dropdown.Item>
                        <Dropdown.Item eventKey="2">
                          Dropdown link
                        </Dropdown.Item>
                      </DropdownButton>{' '}
                    </Card.Title>
                    <AiOutlineFile
                      style={{ fontSize: '150px' }}
                      className="w-100"
                    />
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </>
        </>
      )}
    </Row>
  );
};
