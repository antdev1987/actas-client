import { useEffect } from 'react'
import { useAppProvider } from '../../context/actasContext/AppProvider'
import { useAuth } from '../../context/userContext/UserProvider';

import {
    Button,
    Card,
    Col,
    Dropdown,
    DropdownButton,
    Row,
} from 'react-bootstrap';

import {
    AiOutlineFile,
    AiOutlineFolderOpen,
    AiOutlineReload,
} from 'react-icons/ai';

import Swal from 'sweetalert2/dist/sweetalert2.all.js';


const SideBar = () => {

    const { obtenerAdminFilesfn, adminFilesBd, descargarFilefn,eliminarAdminFilefn } = useAppProvider()
    const { user } = useAuth()

    useEffect(() => {

        obtenerAdminFilesfn()

    }, [])



    console.log(adminFilesBd)

    //funcion para poder registrar cuando un usuario descargar un archivo
    const handleDescargar = (originalName) => {
        // console.log(tipo);
        // console.log('en descargar',originalName)
        descargarFilefn({ originalName })
    }


    //este es para eliminar el archivo
    const handleEliminarFile = (item) => {
        console.log(item);
    
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
              _id: item._id,
            };
            eliminarAdminFilefn(infoNeeded);
            Swal.fire('Eliminado!', 'Usuario Eliminado.', 'success');
          }
        });
      };

    return (
        <>

            {
                adminFilesBd?.map((item, idx) => (
                    <div
                        key={item?.public_id + idx}
                        // onClick={() => {
                        //   setVisualizar(item?.secure_url),
                        //     handleMostrar(false),
                        //     setId(item?.public_id);
                        // }}
                        className={`d-flex justify-content-between border pt-2 pb-2 list-box ${item.public_id === item._id ? 'activeBox' : null
                            }`}
                        style={{ cursor: 'pointer' }}
                    >
                        <AiOutlineFile style={{ fontSize: '50px' }} />
                        <div>
                            <p>{item?.originalname}</p>
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
                                        handleEliminarFile(item)
                                    }
                                >
                                    Eliminar
                                </Dropdown.Item>
                            )}
                            <Dropdown.Item
                                eventKey="2"
                                href={`${item.secure_url}`}
                                download
                                onClick={() => handleDescargar(item.originalname)}
                            >
                                Descargar
                            </Dropdown.Item>
                        </DropdownButton>
                    </div>
                ))
            }

        </>
    )
}

export default SideBar