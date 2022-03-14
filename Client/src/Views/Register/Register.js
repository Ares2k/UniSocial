import Button from "../../Components/Button/Button";
import phoneImgOrange from '../../Assets/Images/unisocial-phone-orange.svg';
import style from './register.module.css';
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value
    const firstname = document.getElementById('firstname').value
    const surname = document.getElementById('surname').value
    const confirmPassword = document.getElementById('confirmPassword').value;

    const response = await fetch('http://192.168.0.74:5000/api/register', {
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

    navigate('/users/mutual');
  }

  return (
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
            />

            <input 
              className={style.field}
              id='firstname'
              placeholder='First Name'
              type='text'
              autoComplete='off'
            />

            <input 
              className={style.field}
              id='surname'
              placeholder='Surname'
              type='text'
              autoComplete='off'
            />

            <input 
              className={style.field}
              id='email'
              placeholder='Email Address'
              type='email'
              autoComplete='off'
            />

            <input 
              className={style.field}
              id='password'
              placeholder='Password'
              type='password'
              autoComplete='off'
            />

            <input 
              className={style.field}
              id='confirmPassword'
              placeholder='Confirm Password'
              type='password'
              autoComplete='off'
            />
          
          <div className={style.buttonHolder}>
            <Button label='Sign Up »' onClick={handleSubmit} className={style.button}/>
            <Button label='Log in Instead?' onClick={() => navigate('/login')} className={style.button} />
          </div>
        </div>
      </div>
    </div>
  );
}
 
export default Register;