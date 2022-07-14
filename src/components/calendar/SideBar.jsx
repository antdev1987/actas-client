import { useEffect, useState } from 'react'
import { useAppProvider } from '../../context/actasContext/AppProvider'
import { useAuth } from '../../context/userContext/UserProvider';

import cliTruncate from "cli-truncate";

import {
    Dropdown,
    DropdownButton,
    Form,
    Row,
} from 'react-bootstrap';

import {
    AiOutlineFile,
} from 'react-icons/ai';

import Swal from 'sweetalert2/dist/sweetalert2.all.js';


const SideBar = () => {

    const { obtenerAdminFilesfn, adminFilesBd, descargarFilefn, eliminarAdminFilefn, subirFilesAdminfn } = useAppProvider()
    const { user } = useAuth()

    //este es para gargar los archivos del sidebar la primera vez que se va a la pagina plan mantenimiento
    useEffect(() => {
        obtenerAdminFilesfn()
    }, [])


    //funcion para poder registrar cuando un usuario descargar un archivo
    const handleDescargar = (originalName) => {
        descargarFilefn({ originalName })
    }


    //este es el input para subir los archivos en el sidebar y automaticamente enviarlo al backend
    const handleChangeFile = (e) => {
        const files = e.target.files
        if (files.length === 0) return
        // console.log(e.target.files)
        const data = new FormData();
        for (var x = 0; x < files.length; x++) {
            // console.log(saveFile[x]);
            data.append(`myFiles`, files[x]);
        }
        subirFilesAdminfn(data)
    }


    //este es para eliminar un archivo del sidebar
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
        <div className='filesBox'>
            <Form.Control
                type="file"
                multiple
                accept=".doc,.DOCX,.xlsx,.pdf"
                onChange={handleChangeFile}
            />
            {
                adminFilesBd?.map((item, idx) => (
                    <div
                        key={item?.public_id + idx}
                        className={`d-flex justify-content-between border pt-2 pb-2 ${item.public_id === item._id ? 'activeBox' : null
                            }`}
                        style={{ cursor: 'pointer' }}
                    >
                        <AiOutlineFile className="iconArchivo" />
                        <p className='word-break-all'>{cliTruncate(item?.originalname, 40)}</p>
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

        </div>
    )
}

export default SideBar