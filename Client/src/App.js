import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';
import Register from './Views/Register/Register';
import Login from './Views/Login/Login';
import UserProfile from './User/UserProfile';
import MutualUsers from './Views/MutualUsers/MutualUsers';
import Navbar from './Components/Navbar/Navbar';
import DisplayUser from './Views/MutualUsers/DisplayUser';
import Home from './Views/Home/Home';
import PageNotFound from './Views/NotFound/PageNotFound';
import ProtectedRoutes from './Routes/ProtectedRoutes';

const App = () => {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<MutualUsers />} />
          <Route path="/home" element={<Home />}/>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />

          <Route element={<ProtectedRoutes />}>
            <Route path='/profile/edit' element={<UserProfile />} />
            <Route path='/users/mutual' element={<MutualUsers />} />
          </Route>

          <Route path='/users/:id' element={<DisplayUser />} />
          <Route path='*' element={<PageNotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;