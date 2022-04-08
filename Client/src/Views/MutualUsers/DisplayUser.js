import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import style from './displayUser.module.css';
import ProfilePicture from "../../Components/ProfilePicture/ProfilePicture";
import { AiOutlineFieldNumber, AiOutlineLink } from 'react-icons/ai';
import { FaGraduationCap, FaRegHandshake, FaUniversity } from 'react-icons/fa';
import { MdOutlineSportsEsports } from 'react-icons/md';
import SocialCard from "../../Components/Socials/SocialCard";
import LinkHeader from "../../Components/LinkHeaders/LinkHeader";
import EducationInfo from "../../Components/Education/EducationInfo";
import { NavbarContext } from "../../App";
import Button from "../../Components/Button/Button";
import chatImg from '../../Assets/Images/chat.svg';

const DisplayUser = () => {
  const [user, setUser] = useState({
    username: '',
    firstname: '',
    surname: '',
    email: '',
    filename: '',
    banner: '',
    course: {
      name: '',
      code: '',
      year: ''
    },
    bio: '',
    hobbies: ''
  });
  const [errorMsg, setErrorMsg] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [selected, setSelected] = useState('links');
  const [mutual, setMutual] = useState('');
  const [userId, setUserId] = useState();
  const { id } = useParams();
  const navigate = useNavigate();
  const { setNavVal } = useContext(NavbarContext);
  let counter = 0;
  
  useEffect(() => {
    let isMounted = true;
    fetch(`http://192.168.0.75:5000/api/mutualUser/?username=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
    .then(res => res.json())
    .then(res => {
      if(res.status === 200) {
        document.title = `${res.user.firstname} ${res.user.surname} @${res.user.username}`;
        const parsedToken = JSON.parse(atob(token.split('.')[1]));

        if (parsedToken.username === res.user.username) {
          navigate('/profile/edit')
        }

        if (isMounted) {
          setUser(res.user);
          setMutual(res.mutualHobbies);
          setNavVal(null);
          setUserId(parsedToken.id);
        }
      } else if(res.status === 404) {
        setErrorMsg('User not found!')
      } else {
        localStorage.removeItem('token');
        return isMounted ? setToken(null) : null;
      }
    })
    .catch(err => {
      console.log(err);
    })

    return () => isMounted = false;
  }, [id, navigate, token])

  const setActive = e => {
    setSelected(e.currentTarget.id);
  }

  const messageClick = () => {
    fetch('http://192.168.0.75:5000/api/conversations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        senderId: userId,
        receiverId: user._id
      })
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === 200) {
        navigate('/chat');
      } else {
        console.log(res);
      }
    })
    .catch(err => {
      console.log(err);
    })
  }

  return token ? (    
    !errorMsg ? (
    <div className={style.container}>
      <div
        className={style.banner}
        style={{
          backgroundImage:
            user.banner
            ? (`linear-gradient(rgba(0, 0, 0, 0.5),
                rgba(0, 0, 0, 0.5)),
                url(/api/images/${user?.banner})`
            ) 

            : (`linear-gradient(rgb(255 255 255 / 50%),
                rgba(0, 0, 0, 0.5))`
            )
        }}
      >
        <div className={style.coverPhoto} onClick={messageClick}>
          <img style={{height: "25px", width: "25px", marginRight: "10px"}} src={chatImg} alt=""/>
          Message
        </div>
      </div>
 
      <div className={style.imagePlacer}>
        <ProfilePicture
          filename={user.filename}
          imageContainer={style.profilePic}
        />

        <div className={style.name}>
          <h1>{ user.firstname } { user.surname }</h1>
          <h2>@{ user.username }</h2>
        </div>
      </div>

      <div className={style.info}>
        <div className={style.bio}>
          <h3>Bio</h3>
          <p>{ user?.bio || 'No bio available' }</p>
        </div>

        <div className={style.bio}>
          <h3>Education</h3>
          <div className={style.courseHeaders}>
            <EducationInfo
              icon={<FaUniversity style={{ width: "25px", height: "25px" }} />}
              courseInfo={"Course"}
            />

            <EducationInfo
              icon={<AiOutlineFieldNumber style={{ width: "25px", height: "25px" }} />}
              courseInfo={"Code"}
            />

            <EducationInfo
              icon={<FaGraduationCap style={{ width: "25px", height: "25px" }} />}
              courseInfo={"Year"}
            />
          </div>

          <div className={style.course} style={{flexDirection: "row", margin: "0"}}>
            <p className={style.courseInfo}>{ user?.course?.name || 'N/A'}</p>
            <p className={style.courseInfo}>{ user?.course?.code || 'N/A'}</p>
            <p className={style.courseInfo}>{ user?.course?.year || 'N/A'}</p>
          </div>
        </div>

        <div className={style.links}>
          <LinkHeader
            id={"links"}
            selected={selected}
            onClick={setActive}
            icon={<AiOutlineLink />}
            title={"Socials"}
          />

          <LinkHeader
            id={"mutual"}
            selected={selected}
            onClick={setActive}
            icon={<FaRegHandshake />}
            title={"Mutuals"}
          />

          <LinkHeader
            id={"all"}
            selected={selected}
            onClick={setActive}
            icon={<MdOutlineSportsEsports />}
            title={"All"}
          />
        </div>

        {selected === 'links' &&
          <div>
            {user?.socials?.length > 0 ? user.socials.map(social => (
              <a
                href={`//${social.link}`}
                target="_blank"
                rel="noopener noreferrer"
                key={counter}
                style={{ textDecoration: "none", color: "inherit" }}
              >
              <SocialCard
                key={counter++}
                image={social.image}
                title={social.title}
                description={social.link}
              />
              </a>
            )) : <p style={{fontSize: "1.3rem"}}>No Socials Found</p>}
          </div>
        }

        {selected === 'mutual' &&
          (mutual.length > 0 ?
            (<div className={style.allHobbies}>
              <p>
                <span style={{ fontWeight: "bold", color: "#df691a" }}>
                  You
                </span> and <span style={{ fontWeight: "bold", color: "#df691a" }}>
                  {user.firstname}
                </span> share the following interests:
              </p>

              <div className={style.hobbies}>
                {mutual.map(hobby => (
                  <p key={hobby} className={style.hobbyBubble}>
                    {hobby}
                  </p>
                ))}
              </div>
            </div>) : (
              <p style={{ fontSize: "1.3rem" }}>
                You and
                <span style={{ color: "#df691a", fontWeight: "bold" }}> {user.firstname} </span>
                don't share any mutual interests
              </p>
            ))
          }

        {selected === 'all' &&
          (user.hobbies.length > 0 ? 
            ( <div className={style.allHobbies}>
              <p>
                <span style={{fontWeight: "bold", color: "#df691a"}}>
                  {user.firstname}
                </span> has interests in:
              </p>
            
              <div className={style.hobbies}>
                {user.hobbies.map(hobby => (
                  <p key={hobby} className={style.hobbyBubble}>
                    {hobby}
                  </p>
                ))}
              </div>
            </div> ) : (
            <p style={{fontSize: "1.3rem"}}>
              <span style={{color: "#df691a", fontWeight: "bold"}}>{user.firstname} </span>
              has not yet configured their interests.
            </p>
          ))
        }
      </div>
    </div>) : ( <h1>{errorMsg}</h1> )
    
  ) : <Navigate to="/login"/>;
}
 
export default DisplayUser;