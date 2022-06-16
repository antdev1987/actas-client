import { useEffect } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import { Formulario, MostrarResultados } from '../components/Control';
import { useAppProvider } from '../context/actasContext/AppProvider';

const Control = () => {
  const { visualizar, setVisualizar, handleMostrar } = useAppProvider();

  useEffect(() => {
    setVisualizar(false);
    handleMostrar("none")
  }, []);

  return (
    <Container
      className="pt-5"
      fluid={'lg'}
    >
      <Formulario />
      <Row>
        <Col sm>
          <MostrarResultados />
        </Col>

        {visualizar && (
          <Col sm>
            {' '}
            <iframe
              width="1366px"
              height="623px"
              src={`https://docs.google.com/gview?url=${visualizar}&embedded=true`}
            ></iframe>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default Control;
