import React, { useState } from "react";

import { useAppProvider } from "../../context/actasContext/AppProvider";
import { CSSTransition } from "react-transition-group";

import "./AddUserForm.css";

const initialInputs = {
  email: "",
  name: "",
  password: "",
};

//componente de la pagina admin user
const AddUserForm = () => {
  const { createNewUserAppfn } = useAppProvider();
  const [inputs, setInputs] = useState(initialInputs);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    createNewUserAppfn(inputs);

    setInputs({
      email: "",
      name: "",
      password: "",
    });
  };

  //este muestra y oculta el formulario para agregar nuevo usuario en la admin user
  const handleShow = () => {
    setShowForm(!showForm);
  };

  return (
    <div className="border border-3 rounded p-2 ">
      <button onClick={handleShow} className="btn btn-primary">
        Crear Usuario
      </button>

      <CSSTransition
        in={showForm}
        unmountOnExit
        timeout={400}
        classNames="slide"
      >
        <form
          className={`w-50 m-auto mt-1 border p-3 bg-light shadow`}
          onSubmit={handleSubmit}
        >
          <h3 className="text-center mb-3">Crear un nuevo Usuario</h3>

          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              id="userName"
              name="email"
              placeholder="Email"
              value={inputs.email}
              onChange={(e) =>
                setInputs({ ...inputs, [e.target.name]: e.target.value })
              }
            />
            <span className="input-group-text">Y</span>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              placeholder="name"
              value={inputs.name}
              onChange={(e) =>
                setInputs({ ...inputs, [e.target.name]: e.target.value })
              }
            />
          </div>

          <div className="mb-3">
            <input
              type="password"
              className="form-control"
              id="exampleInputPassword1"
              placeholder="password"
              name="password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, [e.target.name]: e.target.value })
              }
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </CSSTransition>
    </div>
  );
};

export default AddUserForm;
