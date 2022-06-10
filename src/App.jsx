
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


import { UserProvider } from "./context/userContext/UserProvider";


import Login from "./pages/Login";

import RegistroActas from "./pages/RegistroActas";

import PublicRouteApp from "./pages/permisos/PublicRouteApp";
import PrivateRouteUser from "./pages/permisos/PrivateRouteUser";

function App() {

  return (
   

    <BrowserRouter>
    <UserProvider>

      <Routes>



      <Route element={<PublicRouteApp />}>
        <Route path="/" element={<Login />} />
      </Route>


      <Route element={<PrivateRouteUser />}>
          <Route path="/registro-actas" element={<RegistroActas />} />
      </Route>



      </Routes>

    </UserProvider>
    </BrowserRouter>

  )
}

export default App
