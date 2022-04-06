import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import Register from './Views/Register/Register';
import Login from './Views/Login/Login';
import MutualUsers from './Views/MutualUsers/MutualUsers';
import Navbar from './Components/Navbar/Navbar';
import DisplayUser from './Views/MutualUsers/DisplayUser';
import Home from './Views/Home/Home';
import PageNotFound from './Views/NotFound/PageNotFound';
import ProtectedRoutes from './Routes/ProtectedRoutes';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditProfile from './Views/User/EditProfile';
import { createContext, useState } from 'react';
import Chat from './Views/ChatDashboard/Chat';

export const NavbarContext = createContext({
  navVal: "Profile",
  setNavVal: () => {}
});

const App = () => {
  const [navVal, setNavVal] = useState('Profile');
  const value = { navVal, setNavVal };

  return (
    <Router>
      <div className="App">
        <NavbarContext.Provider value={value}>
          <Navbar />
          <ToastContainer
            position="top-right"
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
          />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />}/>
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />

            <Route element={<ProtectedRoutes />}>
              <Route path='/profile/edit' element={<EditProfile />} />
              <Route path='/mutual' element={<MutualUsers />} />
              <Route path='/chat' element={<Chat />}/>
            </Route>

            <Route path='/users/:id' element={<DisplayUser />} />
            <Route path='*' element={<PageNotFound />} />
          </Routes>
        </NavbarContext.Provider>
      </div>
    </Router>
  );
}

export default App;