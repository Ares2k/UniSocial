import Button from "../../Components/Button/Button";
import phoneImgOrange from '../../Assets/Images/unisocial-phone-orange.svg';
import style from './register.module.css';
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";

const Register = () => {
  document.title = 'UniSocial';

  const location = useLocation();
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [input, setInput] = useState({
    username: '',
    firstname: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState(input);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setInput({
      ...input,
      [e.target.id]: e.target.value
    });

    e.target.value ? 
      setError({
        ...error,
        [e.target.id + "Err"]: ""
      }) : setError({
        ...error,
        [e.target.id + "Err"]: `${e.target.placeholder} required`
      })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(validateInput(input)) {
      let isMounted = true;
      let response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "username": input.username,
          "email": input.email,
          "password": input.password,
          "confirmPass": input.confirmPassword,
          "firstname": input.firstname,
          "surname": input.surname
        })
      });

      response = await response.json();
      console.log(response)

      if (response.status === 11000) {
        localStorage.removeItem('token');

        if (isMounted) {
          setError({usernameErr: response.error});
        }
      }

      if (response.status !== 200) {
        localStorage.removeItem('token');
        if(isMounted) {
          setToken(null);
        }

      } else {
        localStorage.setItem('token', response.token);

        if (location?.state?.from) {
          navigate(location.state.from, { state: { from: location } });
        } else {
          navigate('/mutual', { state: { from: location } });
        }
      }

      return () => isMounted = false;
    }
  }

  const validateUsername = (username) => {
    return String(username)
      .match(
        /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
      );
  }

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  }

  const validatePassword = (password) => {
    return String(password)
      .match(
        /^[A-Za-z]\w{4,20}$/
      );
  }

  const validateInput = (body) => {
    const { username, email, firstname, surname, password, confirmPassword } = body;
    let usernameErr = "";
    let firstnameErr = "";
    let surnameErr = "";
    let emailErr = "";
    let passwordErr = "";
    let confirmPasswordErr = "";

    if (typeof username !== 'string' || !validateUsername(username)) {
      usernameErr = "Invalid username";
    }

    if (username.length < 5) {
      usernameErr = "Username must have atleast 5 characters";
    }

    if (username.length > 20) {
      usernameErr = "Username must not exceed 20 characters"
    }

    if (!username) {
      usernameErr = "Username required";
    }

    if (typeof email !== 'string' || !validateEmail(email)) {
      emailErr = "Invalid email format";
    }

    if (!email) {
      emailErr = "Email required";
    }

    if (typeof firstname !== 'string') {
      firstnameErr = "Invalid first name";
    }

    if (!firstname) {
      firstnameErr = "First name required";
    }

    if (typeof surname !== 'string') {
      surnameErr = "Invalid surname";
    }

    if (!surname) {
      surnameErr = "Surname required";
    }

    if (typeof password !== 'string' || !validatePassword(password)) {
      passwordErr = "Invalid Password"
    }

    if (password.length < 5) {
      passwordErr = "Password must have atleast 5 characters";
    }

    if (password.length > 20) {
      passwordErr = "Password must not exceed 20 characters";
    }

    if (!password) {
      passwordErr = "Password required";
    }

    if (typeof confirmPassword !== 'string' || !validatePassword(confirmPassword)) {
      confirmPasswordErr = "Invalid Password";
    } 

    if (!confirmPassword) {
      confirmPasswordErr = "Please type your password again";
    }

    if (password !== confirmPassword) {
      confirmPasswordErr = "Passwords don't match";
    }

    setError({
      usernameErr,
      firstnameErr,
      surnameErr,
      emailErr,
      passwordErr,
      confirmPasswordErr
    });

    return (!usernameErr &&
      !firstnameErr &&
      !surnameErr &&
      !emailErr &&
      !passwordErr &&
      !confirmPasswordErr
    ) ? true : false;
  }

  return !token ? (
    <div className={style.container}>
      <div className={style.registrationBox}>
        <img className={style.img} src={phoneImgOrange} alt=""/>
        
        <div className={style.right}>
          <h1 className={style.h1}>Create your account</h1>
          <p className={style.p}>It's quick and easy.</p>

            <input
              className={style.field}
              id='username'
              placeholder='Username'
              type='text'
              autoComplete='off'
              onChange={handleChange}
            />
            {error.usernameErr ? (
              <div className={style.errMsg}>{error.usernameErr}</div>
            ) : ( <div className={style.errMsg}>&nbsp;</div> )}
            
            <input 
              className={style.field}
              id='firstname'
              placeholder='First Name'
              type='text'
              autoComplete='off'
              onChange={handleChange}
            />
            {error.firstnameErr ? (
              <div className={style.errMsg}>{error.firstnameErr}</div>
            ) : ( <div className={style.errMsg}>&nbsp;</div> )}

            <input 
              className={style.field}
              id='surname'
              placeholder='Surname'
              type='text'
              autoComplete='off'
              onChange={handleChange}
            />
            {error.surnameErr ? (
              <div className={style.errMsg}>{error.surnameErr}</div>
            ) : ( <div className={style.errMsg}>&nbsp;</div> )}

            <input 
              className={style.field}
              id='email'
              placeholder='Email Address'
              type='email'
              autoComplete='off'
              onChange={handleChange}
            />
            {error.emailErr ? (
              <div className={style.errMsg}>{error.emailErr}</div>
            ) : ( <div className={style.errMsg}>&nbsp;</div> )}
            
            <input 
              className={style.field}
              id='password'
              placeholder='Password'
              type='password'
              autoComplete='off'
              onChange={handleChange}
            />
            {error.passwordErr ? (
              <div className={style.errMsg}>{error.passwordErr}</div>
             ) : ( <div className={style.errMsg}>&nbsp;</div> )}
            
            <input 
              className={style.field}
              id='confirmPassword'
              placeholder='Confirm Password'
              type='password'
              autoComplete='off'
              onChange={handleChange}
            />
            {error.confirmPasswordErr ? (
              <div className={style.errMsg}>{error.confirmPasswordErr}</div>
            ) : ( <div className={style.errMsg}>&nbsp;</div> )}
          
          <div className={style.buttonHolder}>
            <Button label='Sign Up »' onClick={handleSubmit} className={style.button}/>
            <div className={style.alreadyRegistered}>
              <p>Already registered?</p>
              <Link to="/login" style={{textDecoration: "none", fontWeight: "bold"}}>
                Sign in.
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  ) : <Navigate to="/mutual" />;
}
 
export default Register;