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

const App = () => {
  const isLoggedIn = localStorage.getItem('token');

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={isLoggedIn ? <MutualUsers /> : <Home />}/>
          <Route path="/home" element={<Home />}/>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={isLoggedIn ? <MutualUsers /> : <Login/>} />
          <Route path='/profile/edit' element={<UserProfile />} />
          <Route path='/users/mutual' element={<MutualUsers />} />
          <Route path='/users/:id' element={<DisplayUser />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
