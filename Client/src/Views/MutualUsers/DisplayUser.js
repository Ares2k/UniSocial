import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import style from './displayUser.module.css';
import ProfilePicture from "../../Components/ProfilePicture/ProfilePicture";
import { AiOutlineFieldNumber, AiOutlineLink } from 'react-icons/ai';
import { FaGraduationCap, FaRegHandshake, FaUniversity } from 'react-icons/fa';
import { MdOutlineSportsEsports } from 'react-icons/md';
import instagramImg from '../../Assets/Images/instagram.svg';
import linkedInImg from '../../Assets/Images/linkedin.svg';
import facebookImg from '../../Assets/Images/facebook.svg';
import twitterImg from '../../Assets/Images/twitter.svg';
import webImg from '../../Assets/Images/web.svg';
import SocialCard from "../../Components/Socials/SocialCard";
import LinkHeader from "../../Components/LinkHeaders/LinkHeader";
import EducationInfo from "../../Components/Education/EducationHeader";

const DisplayUser = () => {
  const [user, setUser] = useState({
    username: '',
    firstname: '',
    surname: '',
    email: '',
    filename: '',
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
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    // let token = localStorage.getItem('token');

    // if(!token) {
    //   console.log('No JWT token found. Please login again.');
    //   navigate('/login');
    // }

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
        document.title = `${res.user.firstname} ${res.user.surname} @${res.user.username}`;
        setUser(res.user);
        setMutual(res.mutualHobbies);
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
  }, [id, navigate, token])

  const setActive = e => {
    console.log('asdasdasd');
    setSelected(e.currentTarget.id);
  }

  return token ? (    
    !errorMsg ? (
    <div className={style.container}>
      <div className={style.banner}>
        <p>Hey, I'm Timur! 👋</p>
      </div>
 
      <div className={style.imagePlacer}>
        <div className={style.profilePic}>
          <ProfilePicture 
            filename={user.filename}
            className={style.image}
          />
        </div>

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
            <p className={style.courseInfo}>{ user?.course?.name }</p>
            <p className={style.courseInfo}>{ user?.course?.code }</p>
            <p className={style.courseInfo}>{ user?.course?.year }</p>
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
            <SocialCard
              image={instagramImg}
              title={"Instagram"}
              description={"instagram.com/timur_sult"}
            />

            <SocialCard
              image={linkedInImg}
              title={"LinkedIn"}
              description={"linkedin.com/in/tsult/"}
            />

            <SocialCard
              image={facebookImg}
              title={"Facebook"}
              description={"facebook.com/timur.sultanov.587"}
            />

            <SocialCard
              image={twitterImg}
              title={"Twitter"}
              description={"twitter.com/ares2k"}
            />

            <SocialCard
              image={webImg}
              title={"My Site"}
              description={"Timur.com"}
            />
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
                <span style={{ color: "#df691a", fontWeight: "bold" }}>{user.username} </span>
                has not yet configured their profile.
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
              <span style={{color: "#df691a", fontWeight: "bold"}}>{user.username} </span>
              has not yet configured their profile.
            </p>
          ))
        }
      </div>
    </div>) : ( <h1>{errorMsg}</h1> )
    
  ) : <Navigate to="/login"/>;
}
 
export default DisplayUser;