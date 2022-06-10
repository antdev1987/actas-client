
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


import { UserProvider } from "./context/userContext/UserProvider";


import Login from "./pages/Login";
import NavBar from "./layout/NavBar";

import RegistroActas from "./pages/RegistroActas";
import Control from "./pages/Control";
import PlanMantenimiento from "./pages/PlanMantenimiento";

import PublicRouteApp from "./pages/permisos/PublicRouteApp";
import PrivateRouteUser from "./pages/permisos/PrivateRouteUser";

function App() {

  return (
   

    <BrowserRouter>
    <UserProvider>
      <NavBar/>
      <Routes>



      <Route element={<PublicRouteApp />}>
        <Route path="/" element={<Login />} />
      </Route>


      <Route element={<PrivateRouteUser />}>
          <Route path="/registro-actas" element={<RegistroActas />} />
          <Route path='/control' element={<Control />} />
          <Route path='plan-mantenimiento' element={<PlanMantenimiento />} />
      </Route>



      </Routes>

    </UserProvider>
    </BrowserRouter>

  )
}

export default App
