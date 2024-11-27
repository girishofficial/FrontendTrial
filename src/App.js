import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './Components/Login/Login';
import Dashboard from './Components/Dashboard/Dashboard';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import PrivateRoute from './utils/PrivateRoute';

const onLoginSuccess = (data) => {
  console.log("Login successful:", data);

};

const router = createBrowserRouter([
  {
    path: "/",
    element: <div><Login onLoginSuccess={onLoginSuccess} /></div>,
  },
  {
    path: "/dashboard",
    element: <div><Dashboard/></div>
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router}/>
    </div>
  );
}

export default App;
