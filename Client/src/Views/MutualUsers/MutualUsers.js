import { useEffect, useState } from "react";
import DisplayUsers from "./DisplayUsers";
import { useNavigate, Link } from "react-router-dom";
import mutual from './mutual.module.css';

const MutualUsers = () => {
  const [users, setUsers] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let token = localStorage.getItem('token');

    if(!token) {
      console.log('No JWT token found. Please login again.');
      navigate('/login');
    }

    fetch('http://localhost:5000/api/mutual/', {
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
        navigate('/login');
      } else {
        setUsers(res.users);
      }
    })
  .catch(err => {
    console.log(err);
  })

    // const mutualUsers = fetchUsers('http://localhost:5000/api/mutual/', token);
    // console.log(mutualUsers);

    // if(mutualUsers)
    //   setUsers(mutualUsers);
    // else
    //   console.log(mutualUsers);
  }, [navigate])
  
  return (
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
      {/* { users && <DisplayUsers users={users} /> } */}
    </div>
  );
}
 
export default MutualUsers;