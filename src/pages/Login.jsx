import React, { useState } from "react";
import { useAuth } from "../context/userContext/UserProvider";

const initialValues = {
  email: "",
  password: "",
};

const Login = () => {
  const [inputs, setInputs] = useState(initialValues);
  const [error, setError] = useState("")
  const { loginUserfn } = useAuth();

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUserfn(inputs, setError);
  };

  const handleInputs = (e) => {
    setInputs({
      ...inputs,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section className="m-auto pt-3" style={{maxWidth:'800px'}}>

      <h2 className="text-center bg-danger text-white py-5 rounded">
        {error}
      </h2>
      
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