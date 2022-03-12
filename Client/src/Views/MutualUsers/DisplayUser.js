import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const DisplayUser = () => {
  const [user, setUser] = useState(null);
  const [errorMsg, setErrorMsg] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    let token = localStorage.getItem('token');

    if(!token) {
      console.log('No JWT token found. Please login again.');
      navigate('/login');
    }

    fetch(`http://192.168.0.74:5000/api/mutual/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res.status === 200) {
        setUser(res.user);
      } else if(res.status === 404) {
        console.log(res);
        setErrorMsg('User not found!')
      } else {
        navigate('/login');
      }
    })
    .catch(err => {
      console.log(err);
    })
  }, [id, navigate])
  
  return (
    <div>
      {user &&
      <div>
        <h1>{user.username}</h1>
        <p>{user.firstname} {user.surname}</p>
        <p>{user.course.code}</p>
        <p>{user.course.name}</p>
        <p>{user.course.year}</p>
        <p>{user.bio}</p>
        {user.hobbies.map((hobby) => (
          <p key={hobby}>{hobby}</p>
        ))}
      </div>
      }

      {errorMsg && <h1>{errorMsg}</h1>}
    </div>
  );
}
 
export default DisplayUser;