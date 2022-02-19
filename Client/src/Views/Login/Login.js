import Button from "../../Components/Button";
import { useNavigate  } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    let response = await fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'username': username,
        'password': password
      })
    });
  
    response = await response.json();
    
    if(response.status === 401) {
      console.log(response);
    } else {
      localStorage.setItem('token', response.token);
      navigate('/users/mutual');
    }
  }

  return (
    <div class="container">
      <input id='username' placeholder='Username' type='text' autoComplete='off' />
      <input id='password' placeholder='Password' type='password' autoComplete='off' />
      <Button label='Sign In'/>
    </div>
  );
}
 
export default Login;