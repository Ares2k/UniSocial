import Button from "../../Components/Button/Button";
// import './register.css';
import { FaUserAlt } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';
import phoneImg from '../../Assets/Images/unisocial-phone.svg';
import register from './register.module.css';
import style from '../../Components/Button/button.module.css';

const handleSubmit = async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value
  const email = document.getElementById('email').value
  const password = document.getElementById('password').value
  const firstname = document.getElementById('firstname').value
  const surname = document.getElementById('surname').value
  const confirmPassword = document.getElementById('confirmPassword').value;

  const response = await fetch('http://localhost:5000/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "username": username,
      "email": email,
      "password": password,
      "confirmPass": confirmPassword,
      "firstname": firstname,
      "surname": surname
    })
  });

  const content = await response.json();
  console.log(content);
}

const Register = () => {

  return (
    <div className={register.container}>
      <div className={register.registrationBox}>
        <img className={register.img} src={phoneImg} alt=""/>
        <div className={register.right}>
          <h1 className={register.h1}>Create your account</h1>
          <p className={register.p}>It's quick and easy.</p>

            <input
              className={register.field}
              id='username'
              placeholder='Username'
              type='text'
              autoComplete='off'
            />

            <input 
              className={register.field}
              id='firstname'
              placeholder='First Name'
              type='text'
              autoComplete='off'
            />

            <input 
              className={register.field}
              id='surname'
              placeholder='Surname'
              type='text'
              autoComplete='off'
            />

            <input 
              className={register.field}
              id='email'
              placeholder='Email Address'
              type='email'
              autoComplete='off'
            />

            <input 
              className={register.field}
              id='password'
              placeholder='Password'
              type='password'
              autoComplete='off'
            />

            <input 
              className={register.field}
              id='confirmPassword'
              placeholder='Confirm Password'
              type='password'
              autoComplete='off'
            />
            
            <Button label='Register' onClick={handleSubmit} className={style.button}/>
        </div>
      </div>
    </div>
  );
}
 
export default Register;