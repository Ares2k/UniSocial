import Button from "../../Components/Button";
import './register.css';
import { FaUserAlt } from 'react-icons/fa';
import { FaUserCircle } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';
import phoneImg from '../../Assets/Images/unisocial-phone.svg';

const register = async (e) => {
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
    <div className="container">
      <div className="registration-box">
        <img src={phoneImg} alt=""/>
        <div className="right">
          <h1>Create your account</h1>
          <p>It's quick and easy.</p>
            <input className="field" id='username'        placeholder='Username'         type='text'     autoComplete='off' />
            <input className="field" id='firstname'       placeholder='First Name'       type='text'     autoComplete='off' />
            <input className="field" id='surname'         placeholder='Surname'          type='text'     autoComplete='off' />
            <input className="field" id='email'           placeholder='Email Address'    type='email'    autoComplete='off' />
            <input className="field" id='password'        placeholder='Password'         type='password' autoComplete='off' />
            <input className="field" id='confirmPassword' placeholder='Confirm Password' type='password' autoComplete='off' />
            <Button label='Register' onClick={register}/>
        </div>
      </div>
    </div>



    // <form className="form" onSubmit={handleSubmit}>
    //   <div id="icons">
    //     <FaUserCircle className="user-icon" size={'1.5em'}/>
    //     <FaUserAlt className="user-icon" size={'1.5em'}/>
    //     <FaUserAlt className="user-icon" size={'1.5em'}/>
    //     <MdEmail className="user-icon" size={'1.5em'}/>
    //     <FaLock className="user-icon" size={'1.5em'}/>
    //     <FaLock className="user-icon" size={'1.5em'}/>
    //   </div>
    //   <input id='username'        placeholder='Username'         type='text'     autoComplete='off' />
    //   <input id='firstname'       placeholder='First Name'       type='text'     autoComplete='off' />
    //   <input id='surname'         placeholder='Surname'          type='text'     autoComplete='off' />
    //   <input id='email'           placeholder='Email Address'    type='email'    autoComplete='off' />
    //   <input id='password'        placeholder='Password'         type='password' autoComplete='off' />
    //   <input id='confirmPassword' placeholder='Confirm Password' type='password' autoComplete='off' />
    //   <Button label='Register' onClick={register}/>
    // </form>
  );
}
 
export default Register;