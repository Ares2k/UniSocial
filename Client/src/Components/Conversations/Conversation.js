import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfilePicture from '../ProfilePicture/ProfilePicture';
import style from './conversation.module.css';
import { FaRegUserCircle } from 'react-icons/fa';

const Conversation = ({ conversation, currentUser }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const friendId = conversation.members.find(m => m !== currentUser.id);
    const token = localStorage.getItem('token');

    fetch(`http://192.168.0.75:5000/api/mutualUser/?id=${friendId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === 200) {
        return isMounted ? setUser(res.user) : null;
      }
      console.log(res);
    })
    .catch(err => {
      console.log(err);
    })

    return () => isMounted = false;
      
  }, [conversation, currentUser])

  return (
    <div className={style.conversation}>
      <div>
        <ProfilePicture 
          filename={user?.filename}
          imageContainer={style.profilePic}
        />
        <p
          className={style.profileLink}
          onClick={() => navigate(`/users/${user?.username}`)}
        ><FaRegUserCircle size={"20px"} style={{marginRight: "5px"}}/>
          Profile
        </p>
      </div>
      
      <div className={style.conversationName}>
        <p>{user?.firstname} {user?.surname}</p>
        <p className={style.username}>@{user?.username}</p>
      </div>
    </div>
  );
}
 
export default Conversation;