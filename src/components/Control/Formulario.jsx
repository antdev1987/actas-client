import React, { useState } from 'react';

import { Button, Form } from 'react-bootstrap';
import { useToasts } from 'react-toast-notifications';

import { useAppProvider } from '../../context/actasContext/AppProvider';

export const Formulario = () => {
  // Obteninedo informacion de la base de datos
  const {
    baseDatosActas,
    handleMostrar,
    setVisualizar,
    filtrarbaseDeDatosActas,
  } = useAppProvider();

  // obteniendo valores de los inputs
  const [getValues, setGetValues] = useState({
    selector: 'entrega',
    nombre: '',
  });

  const savingValues = (e) => {
    setGetValues({ ...getValues, [e.target.name]: e.target.value });
  };

  const filtrar = async (e) => {
    e.preventDefault();

    filtrarbaseDeDatosActas(getValues.selector, getValues.nombre);

    handleMostrar(true);
    setVisualizar(false);
  };

  return (
    <Form onSubmit={filtrar} style={{ maxWidth: '900px', margin: '0 auto' }}>
      <h2 className="text-center">Registros de Actas</h2>

      <div className="d-flex">
        <Form.Group className="" controlId="formBasicPassword">
          <Form.Label>Tipo de acta</Form.Label>
          <Form.Select name="selector" onChange={savingValues}>
            <option value="entrega">Entrega</option>
            <option value="devolucion">Devolucion</option>
            <option value="calendario">Calendario</option>
          </Form.Select>
        </Form.Group>

        <Form.Group
          className=""
          style={{ flex: '1' }}
          controlId="formBasicEmail"
        >
          <Form.Label>Nombre del usuario: </Form.Label>
          <Form.Control
            type="text"
            name="nombre"
            placeholder="Ingrese nombre"
            onChange={savingValues}
          />
        </Form.Group>
      </div>

      <Button type="submit" className="mt-3" disabled={!getValues.nombre}>
        Buscar
      </Button>
    </Form>
  );
};
