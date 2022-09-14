import React, { useEffect } from "react";

import { useAppProvider } from "../context/actasContext/AppProvider";
import { useAuth } from "../context/userContext/UserProvider";
import axios from "axios";

import ListUsers from "../components/adminUsers/ListUsers";
import AddUserForm from "../components/adminUsers/AddUserForm";

const AdminUsers = () => {
  const { setUserBd, userBd, setIsActiveLoading } =useAppProvider();
  const { setUser } = useAuth();

  //este codigo abajo cargara los usuario disponibles de la base de datos siempre que este en esta pagina (Admin Users)
  useEffect(() => {
    console.log("getting user useEffect");
    setIsActiveLoading(true);
    const getUser = async () => {
      const token = JSON.parse(localStorage.getItem("uid"));
      if (!token) {
        setUser("");
        return;
      }
      const config = {
        headers: {
          Authorization: `Bearer ${token.token}`,
        },
      };

      try {
        const endPoint = `${import.meta.env.VITE_URL}/user/ver-usuario`;
        const { data } = await axios(endPoint, config);
        console.log(data);
        setIsActiveLoading(false);
        setUserBd(data);
      } catch (error) {
        console.log(error);
        setIsActiveLoading(false);
      }
    };

    getUser();
  }, [userBd.length]);

  console.log("pagina admin user");

  return (
    <div>
      <AddUserForm />
      <ListUsers userBd={userBd} />
    </div>
  );
};

export default AdminUsers;