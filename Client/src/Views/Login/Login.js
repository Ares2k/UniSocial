import Button from "../../Components/Button/Button";
import { Navigate, useLocation, useNavigate  } from "react-router-dom";
import { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    let response = await fetch('http://192.168.0.74:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    });
  
    response = await response.json();
    
    if(response.status === 401) {
      console.log(response);
      /*
       * Clear JWT token upon unsuccessful login to 
       * prevent token tampering/fabrication */
      localStorage.removeItem('token');
      setToken(null);
    } else {
      localStorage.setItem('token', response.token);
      setToken(true);

      /* 
       * If a protected route was attempted to be accessed before
       * prompting login, visit that route otherwise redirect
       * to mutual users */
      if(location?.state?.from) {
        navigate(location.state.from);
      } else {
        navigate('/users/mutual');
      }
    }
  }

  return !token ? (
    <div className="container">
      <input id='username' placeholder='Username' type='text' autoComplete='off' />
      <input id='password' placeholder='Password' type='password' autoComplete='off' />
      <Button label='Sign In' onClick={handleSubmit}/>
    </div>
  ) : <Navigate to="/users/mutual"/>;
}
 
export default Login;