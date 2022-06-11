
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import { ToastProvider } from "react-toast-notifications";

import { UserProvider } from "./context/userContext/UserProvider";
import { AppProvider } from "./context/actasContext/AppProvider";

import Login from "./pages/Login";
import NavBar from "./layout/NavBar";

import RegistroActas from "./pages/RegistroActas";
import Control from "./pages/Control";
import PlanMantenimiento from "./pages/PlanMantenimiento";

import PublicRouteApp from "./pages/permisos/PublicRouteApp";
import PrivateRouteUser from "./pages/permisos/PrivateRouteUser";
import PrivateRouteAdmin from "./pages/permisos/PrivateRouteAdmin";

import AdminUsers from "./pages/AdminUsers";


function App() {

  return (
   
    <BrowserRouter>
    <UserProvider>
      <AppProvider>
      <NavBar/>
      <ToastProvider>
      <Routes>



      <Route element={<PublicRouteApp />}>
        <Route path="/" element={<Login />} />
      </Route>


      <Route element={<PrivateRouteUser />}>
          <Route path="/registro-actas" element={<RegistroActas />} />
          <Route path='/control' element={<Control />} />
          <Route path='plan-mantenimiento' element={<PlanMantenimiento />} />
      </Route>


      <Route element={<PrivateRouteAdmin />}>
              <Route path='/admin/admin-users' element={<AdminUsers />}/>
              {/* <Route path='/admin/mantencion' element={<Mantencion  />}/> */}
      </Route>

      </Routes>
      </ToastProvider>
      </AppProvider>
    </UserProvider>
    </BrowserRouter>


  )
}

export default App
