import React, { useEffect } from 'react'
import { useAuth } from '../context/userContext/UserProvider'

import Accordion from 'react-bootstrap/Accordion'

const Bitacora = () => {

  const { movientosUsuariosfn, movientosUsuarios } = useAuth()

  //este obtiene de la base de datos todos los movimientos de los usuarios
  useEffect(() => {
    movientosUsuariosfn()
  }, [])


  console.log('pagina bitacora')


  return (
    <>
      <h3 className='text-center my-4'>Movimientos de Usuarios</h3>
      <main className='container-lg mt-4'>

        <Accordion className='shadow'>
          {movientosUsuarios.map(item => (

            <Accordion.Item key={item._id} eventKey={item._id}>
              <Accordion.Header >

                <div className='d-flex w-100 px-4 justify-content-between'>

                  <div className=''>
                    <p>Correo: <span className='fw-bold'>{item.email}</span> </p>

                  </div>

                  <div>
                    <p>Ultimo Inicio de Sesion: <span className='fw-bold'>{item.lastLogin}</span> </p>

                  </div>

                </div>

              </Accordion.Header>

              <Accordion.Body className='scrollClass border border-3 border-dark'>

                <div className='table-responsive '>
                  <table className="table table-success  table-striped table-hover table-bordered border-primary">
                    <thead className='table-dark'>
                      <tr>
                        <th scope="col">#</th>
                        <th scope="col">Tipo</th>
                        <th scope="col">accion</th>
                        <th scope="col">fecha</th>
                      </tr>
                    </thead>
                    {item.movimientos.map((mov, idx) => (


                      <tbody key={idx}>
                        <tr>
                          <th scope="row">{idx}</th>
                          <td>{mov.type}</td>
                          <td>{mov.accion}</td>
                          <td>{mov.fecha}</td>
                        </tr>

                      </tbody>
                    ))}
                  </table>
                </div>


              </Accordion.Body>

            </Accordion.Item>
          ))}
        </Accordion>

      </main>
    </>
  )
}

export default Bitacora