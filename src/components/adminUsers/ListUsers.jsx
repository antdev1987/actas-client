import React,{memo} from "react";


import Swal from 'sweetalert2/dist/sweetalert2.all.js';

import { useAppProvider } from "../../context/actasContext/AppProvider";


const ListUsers = ({ userBd }) => {
  const {deleteNewUserAppfn} = useAppProvider()
  console.log(userBd);

  const handleDelete=(id)=>{
    console.log(id)
    Swal.fire({
      title: 'Estas Seguro?',
      text: "No seras capaz de revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Eliminar!',
      
    }).then((result) => {
      if (result.isConfirmed) {

        deleteNewUserAppfn(id)
        Swal.fire(
          'Eliminado!',
          'Usuario Eliminado.',
          'success'
        )
      }
      
    })
  }

  return (
    <div className="mt-3 w-75 m-auto">
      <table className="table">
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Email</th>
            <th scope="col">Name</th>
            <th scope="col">password</th>
            <th scope="col">role</th>
            <th scope="col">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {userBd?.map((item, idx) => (
            <tr key={item._id}>
              <th scope="row">{idx + 1}</th>
              <td>{item.email}</td>
              <td>{item.name}</td>
              <td>{item.password}</td>
              <td>{item.role}</td>
              <td><button onClick={()=>handleDelete(item._id)} className="btn btn-danger">Eliminar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default memo(ListUsers)
//export default ListUsers;