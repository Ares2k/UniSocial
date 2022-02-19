import { useEffect, useState } from "react";
import fetchUsers from "../Services/fetchUsers";
import DisplayUsers from "../Services/DisplayUsers";
import { useNavigate } from "react-router-dom";

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
      { users && <DisplayUsers users={users} /> }
      
      {/* {console.log('SSS')} */}
      {/* {data && <DisplayUsers users={data} />} */}
      {/* { users && <DisplayUsers users={users}/> } */}
    </div>
  );
}
 
export default MutualUsers;