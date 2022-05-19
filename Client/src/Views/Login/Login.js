import Button from "../../Components/Button/Button";
import { Link, Navigate, useLocation, useNavigate  } from "react-router-dom";
import { useState } from "react";
import style from './login.module.css';
import { validateLogin } from '../../Helpers/validateInput';

const Login = () => {
  document.title = 'UniSocial';

  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [error, setError] = useState({
    usernameErr: '',
    passwordErr: ''
  })

  const handleSubmit = async () => {

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    let isMounted = true;
  
    const userInput = validateLogin({username, password});
    
    if(!userInput.usernameErr && !userInput.passwordErr) {
      let response = await fetch('/api/login', {
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
      
      if(response.status !== 200) {
        localStorage.removeItem('token');
        return isMounted ? setError({
          usernameErr: response.error
        }) : null;

      } else {
        localStorage.setItem('token', response.token);
        
        if (location?.state?.from) {
          navigate( location.state.from, {state: {from: location}} );
        } else {
          navigate( '/mutual', {state: {from: location}} );
        }
      }
    } else {
      setError({
        usernameErr: userInput.usernameErr,
        passwordErr: userInput.passwordErr
      })
    }

    return () => isMounted = false;
  }

  return !token ? (
    <div className={style.form}>
      <h1>UniSocial</h1>
      <div className={style.loginForm}>
        <p className={style.welcomeBack}>
          Welcome back!
        </p>

        { error.usernameErr ? <div className={style.errMsg}>{error.usernameErr}</div> : <div>&nbsp;</div> }
        <div className={style.inputWrapper}>
          <div className={style.centeredInput}>
            <p>Username</p>
            <input
              id='username'
              type='text'
              autoComplete='off'
            />
          </div>
        </div>
        
        { error.passwordErr ? <div className={style.errMsg}>{error.passwordErr}</div> : <div>&nbsp;</div> }
        <div className={style.inputWrapper}>
          <div className={style.centeredInput}>
            <p>Password</p>
            <input
              id='password'
              type='password'
              autoComplete='off'
            />
          </div>
        </div>

        <Button
          label='Sign In »'
          onClick={handleSubmit}
          className={style.button}
        />
      </div>

      <p className={style.links}>
        Don't have an account?
        <Link to="/register" style={{color: "#df691ab4", textDecoration: "none", fontWeight: "bold"}}>Register here.</Link>
      </p>
    </div>
  ) : <Navigate to="/mutual" />;
}
 
export default Login;