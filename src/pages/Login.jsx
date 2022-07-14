import React, { useState } from "react";
import { useAuth } from "../context/userContext/UserProvider";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const [inputs, setInputs] = useState(initialValues);
  const [error, setError] = useState("");
  const { loginUserfn } = useAuth();

  //manda el email y passworde que es usuario ingresa en login al backend
  const handleSubmit = (e) => {
    e.preventDefault();

    loginUserfn(inputs, setError);
  };

  //guarda lo que se escribe en los inputs en un state
  const handleInputs = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="m-auto pt-3" style={{ maxWidth: "800px" }}>
      {error && (
        <h4 className="text-center bg-danger text-white py-3 rounded">
          {error}
        </h4>
      )}

      <form className="w-50 m-auto mt-5 p-3 shadow" onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="userName" className="form-label">
            User Name
          </label>
          <input
            type="text"
            name="email"
            className="form-control"
            id="userName"
            onChange={handleInputs}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={handleInputs}
            id="exampleInputPassword1"
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </section>
  );
};

export default Login;
