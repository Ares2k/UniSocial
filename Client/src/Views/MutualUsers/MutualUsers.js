import { useEffect, useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import mutual from './mutual.module.css';

const MutualUsers = () => {
  const [users, setUsers] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  // const token = localStorage.getItem('token');

  useEffect(() => {
    // if(!token) {
    //   console.log('No JWT token found. Please login again.');
    //   navigate('/login');
    // }

    fetch('http://192.168.0.74:5000/api/mutual/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res.status !== 200) {
        console.log(res);
        localStorage.removeItem('token');
        setToken(null);
        // navigate('/login');
      } else {
        setUsers(res.users);
      }
    })
    .catch(err => {
      console.log(err);
    })
  }, [navigate])
  
  return token ? (
    <div>
      {console.log(users)}
      {users && users.map((user) => (
        <div className={mutual.user} key={user._id}>
          <Link to={`/users/${user.username}`} >
            <h2>{ user.username }</h2>
          </Link>

          {user.hobbies.map(hobby => (
            <p key={hobby}>Hobby: {hobby}</p>
          ))}
        </div>
      ))}
    </div>
  ) : <Navigate to="/home"/>;
}
 
export default MutualUsers;