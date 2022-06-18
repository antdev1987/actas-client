import { useEffect, useMemo, useState } from 'react';
import { Col, Container } from 'react-bootstrap';
import { Formulario, MostrarResultados } from '../components/Control';
import { useAppProvider } from '../context/actasContext/AppProvider';

const Control = () => {
  const { visualizar, setVisualizar, handleMostrar, mostrar } =
    useAppProvider();

  useEffect(() => {
    setVisualizar('');
    handleMostrar('none');
  }, []);

  return (
    <Container className="pt-5 " fluid={''}>
      <Formulario />
      <div className="d-flex gap-5">
        <Col>
          <MostrarResultados />
        </Col>

        {mostrar === false && (
          <>
            {visualizar ? (
              <Col style={{ flex: '2' }}>
                {' '}
                <iframe
                  style={{ width: '100%' }}
                  height="623px"
                  src={`https://docs.google.com/gview?url=${visualizar}&embedded=true`}
                ></iframe>
              </Col>
            ) : (
              <Col style={{ flex: '2' }}>
                <div
                  className="d-flex justify-content-center align-items-center bg-secondary"
                  style={{ height: '623px', color: 'white' }}
                >
                  <p style={{ fontSize: '60px' }}>Previsualizar</p>
                </div>
              </Col>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default Control;
