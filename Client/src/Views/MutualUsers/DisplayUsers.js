import { Link } from 'react-router-dom';
import mutual from './mutual.module.css';

const DisplayUsers = ({ users }) => {
  return (
    <div>
      {users.map((user) => (
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
  );
}
 
export default DisplayUsers;