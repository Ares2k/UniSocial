import { useContext, useEffect, useState } from "react";
import { useNavigate, Link, Navigate, useLocation } from "react-router-dom";
import style from './mutual.module.css';
import { notifyLogin, notifyRegister } from "../../Helpers/toastNotify";
import ProfilePicture from "../../Components/ProfilePicture/ProfilePicture";
import Button from "../../Components/Button/Button";
import { FaGraduationCap, FaUniversity } from 'react-icons/fa';
import { AiOutlineFieldNumber } from "react-icons/ai";
import EducationInfo from "../../Components/Education/EducationInfo";
import MutualEducation from "../../Components/Education/MutualEducation";
import { NavbarContext } from "../../App";

const MutualUsers = () => {
  const [users, setUsers] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();
  let location = useLocation();
  const { setNavVal } = useContext(NavbarContext);

  useEffect(() => {
    document.title = 'Mutual Users';
    let isMounted = true;    

    fetch('/api/mutual/', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res.status !== 200) {
        localStorage.removeItem('token');
        return isMounted ? setToken(null) : null;
      } else {
        return isMounted ? setUsers(res.users) : null;
      }
    })
    .catch(err => {
      console.log(err);
    })

    if (isMounted) {
      setNavVal(null);
    }

    if(location?.state?.from?.pathname === '/login') {
      notifyLogin();
    }
      
    if (location?.state?.from?.pathname === '/register') {
      notifyRegister();
    }

    window.history.replaceState({}, document.title);

    return () => isMounted = false;
  }, [navigate])

  return token ? (
    <div>
      {users?.length > 0 ?
      (<div className={style.container}>
        {users.map(user => (

          <div key={user.username} className={style.profileCard}>
            <Link to={`/users/${user.username}`} >
              <ProfilePicture
                filename={user.filename}
                imageContainer={style.profilePic}
              />
            </Link>

            <h1 className={style.fullName}>{user.firstname} {user.surname}</h1>
            <p style={{color: "#b8b8b8", fontSize: "1.1rem"}}>@{user.username}</p>
            <p style={{margin: "20px 0", fontSize: "1.3rem"}}>Mutual interests: {user.hobbies.length}</p>
            
            <MutualEducation
              wrapper={style.courseInfo}
              icon={<FaUniversity style={{ width: "25px", height: "25px" }} />}
              info={user?.course?.name}
            />

            <MutualEducation
              wrapper={style.courseInfo}
              icon={<AiOutlineFieldNumber style={{ width: "25px", height: "25px" }} />}
              info={user?.course?.code}
            />

            <MutualEducation
              wrapper={style.courseInfo}
              icon={<FaGraduationCap style={{ width: "25px", height: "25px" }} />}
              info={user?.course?.year}
            />

            <Button 
              label="View Full Profile"
              className={style.button}
              onClick={() => navigate(`/users/${user.username}`)}
            />
          </div>

        ))}
      </div>) : (
        <div className={style.noUsersFound}>
          <h2>No mutual users found !</h2>
          <p>This can happen due to the following:</p>
          <p>1.) You haven't configured your interests in your <Link to="/profile/edit" style={{ textDecoration: "none", color: "#df691ab4"}}>profile.</Link></p>
          <p>2.) There are no users that share your interests.</p>
        </div>
      )}
    </div>
  ) : <Navigate to="/login" />;
}
 
export default MutualUsers;