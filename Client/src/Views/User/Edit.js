import { useParams, useNavigate, Navigate, useLocation, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import style from './edit.module.css';
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
import EducationInfo from "../../Components/Education/EducationInfo";
import { BiCheckCircle, BiPlusCircle } from 'react-icons/bi';
import { notifyLogin, notifyRegister } from "../../Helpers/toastNotify";
import Popup from "../../Components/Popup/Popup";
import InputBox from "../../Components/Input/InputBox";
import { FiEdit } from "react-icons/fi";
import Button from "../../Components/Button/Button";

const Edit = () => {
  const [profile, setProfile] = useState({
    username: '',
    firstname: '',
    surname: '',
    email: '',
    course: {
      code: '',
      name: '',
      year: ''
    },
    bio: '',
    filename: '',
    socials: []
  });
  const [links, setLinks] = useState([
    { id: "links", title: "Socials", icon: <AiOutlineLink /> },
    { id: "interests", title: "Interests", icon: <MdOutlineSportsEsports /> }
  ]);
  const [error, setError] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [selected, setSelected] = useState('links');
  const [hobbyPopup, setHobbyPopup] = useState(false);
  const [allowInput, setAllowInput] = useState();
  const [addedInput, setAddedInput] = useState(false);
  const [socialLink, setSocialLink] = useState({});
  const navigate = useNavigate();
  const location = useLocation();
  let inputClass = allowInput ? style.enabled : style.disabled;
  let counter = 0;

  useEffect(() => {
    document.title = 'Edit Profile';
    let isMounted = true;

    fetch('http://192.168.0.74:5000/api/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      }
    })
      .then(res => res.json())
      .then(res => {
        if (res.status === 200) {
          const user = res.user;
          const course = res.user.course;
          const hobbies = res.user.hobbies;

          // Construct profile object
          const profileObj = {
            username: user.username,
            firstname: user.firstname,
            surname: user.surname,
            email: user.email,
            course: {
              code: course?.code || '',
              name: course?.name || '',
              year: course?.year
            },
            hobbies,
            bio: user.bio,
            filename: user.filename,
            socials: user.socials
          };

          if (isMounted) {
            setProfile(profileObj);
          }
        } else {
          localStorage.removeItem('token');
          return isMounted ? setToken(null) : null;
        }
      })
      .catch(err => {
        console.log(err);
      });

    if (location?.state?.from?.pathname === '/login') {
      notifyLogin();
    }

    if (location?.state?.from?.pathname === '/register') {
      notifyRegister();
    }

    window.history.replaceState({}, document.title);

    return () => isMounted = false;
  }, [navigate])

  const setActive = e => {
    setSelected(e.currentTarget.id);

    if (e.currentTarget.id === 'interests') {
      setHobbyPopup(true);
    }
  }

  const handleChange = (e) => {
    const field = e.target.id
    const value = e.target.value;
    let course = { ...profile.course }

    value ?
      setError({
        ...error,
        [e.target.id + "Err"]: ""
      }) : setError({
        ...error,
        [e.target.id + "Err"]: `${e.target.placeholder} required`
      })

    if (field === 'code' || field === 'name' || field === 'year') {
      if (field === 'year')
        course[field] = parseInt(value);
      else
        course[field] = value;

      setProfile({
        ...profile,
        course
      });
      return;
    }

    setProfile({
      ...profile,
      [field]: value,
    });
  }

  const editBtnClick = () => setAllowInput(!allowInput);

  const handleSocialInput = (e) => {
    setSocialLink({
      ...socialLink,
      [e.target.id]: e.target.value,
    })
  }

  const addSocialToProfile = () => {    
    const socialArr = profile?.socials;

    if (socialLink?.title || socialLink?.link) {
      socialArr.push(socialLink);
      setProfile({
        ...profile,
        socials: [...socialArr]
      })
    }

    setSocialLink(null);
  }

  const updateProfile = async () => {
    const token = localStorage.getItem('token');

    console.log(profile)

    await fetch('http://192.168.0.74:5000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        profile
      })
    })
    .catch(err => {
      console.log('Unable to update profile');
    })

    window.location.reload();
  }

  return token ? (
    <div className={style.container}>
      <div className={style.banner}>
        <p>Hey, I'm Timur! 👋</p>
      </div>

      <div className={style.imagePlacer}>
        <ProfilePicture
          filename={profile.filename}
          imageContainer={style.profilePic}
        />
      </div>

      <FiEdit
        size={"35px"}
        className={`${style.editIcon} ${style.headerWrapper}`}
        onClick={editBtnClick}
      />

      <div className={style.info}>
        <div className={style.bio}>
          <h2>@{profile.username}</h2>
        </div>

        <h1 style={{display: "flex"}}>Personal Details</h1>
        <div className={style.fullname}>
          <InputBox
            id="firstname"
            label="First Name"
            overrideStyle={style.name}
            val={ profile.firstname }
            onChange = { handleChange }
            allowInput={ allowInput }
            className={ inputClass }
          />

          <InputBox
            id="surname"
            label="Surname"
            overrideStyle={style.name}
            val={ profile.surname }
            onChange = { handleChange }
            allowInput={ allowInput }
            className={ inputClass }
          />
        </div>

        <h1 style={{ display: "flex"}}>Education</h1>
        <div className={style.courseDetails}>
          <InputBox
            id="name"
            label="Course Name"
            overrideStyle={style.courseName}
            val={ profile.course.name }
            onChange={ handleChange }
            allowInput={ allowInput }
            className={ inputClass }
          />
          
          <InputBox
            id="code"
            label="Course Code"
            overrideStyle={style.courseCode}
            val={ profile.course.code }
            onChange={ handleChange }
            allowInput={ allowInput }
            className={ inputClass }
          />

          <div className={style.selectBox}>
            <p>Year</p>
            <select
              id='year'
              name='year'
              value={profile?.course?.year}
              onChange={handleChange}
              disabled={allowInput ? false : true}
              className={ style }
            >

              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
            </select>
          </div>
        </div>

        <div className={style.bio}>
          <h1>Bio</h1>
          <textarea
            id='bio'
            name='bio'
            value={ profile?.bio }
            placeholder='Describe yourself'
            type='text'
            autoComplete='off'
            onChange={ handleChange }
            disabled={ allowInput ? false : true }
            className={ inputClass }
          />
        </div>

        {links &&
        <div className={style.links}>

          {links.map(link => (
            <LinkHeader
              key={link.id}
              id={link.id}
              selected={selected}
              onClick={allowInput && setActive}
              icon={link.icon}
              title={link.title}
            />
          ))}
        </div>}

        {selected === 'interests' &&
          hobbyPopup &&
          allowInput &&
          <Popup
            trigger={hobbyPopup}
            setTrigger={setHobbyPopup}
            profile={profile}
            setProfile={setProfile}
            setSelected={setSelected}
          />
        }

        {selected === 'links' &&
          <div>
            {profile?.socials?.length > 0 && profile.socials.map(social => (
              <a
                href={`//${social.link}`}
                target="_blank"
                rel="noopener noreferrer"
                key={counter}
                style={{textDecoration: "none", color: "inherit"}}
              >

                <SocialCard
                  key={counter++}
                  image={social.image}
                  title={social.title}
                  description={social.link}
                  />
              </a>
            ))}

            {addedInput &&
              <div className={style.socialInputWrapper}>
                <InputBox
                  id="title"
                  label="title"
                  title="Add a title"
                  allowInput={true}
                  overrideStyle={style?.linkInput}
                  onChange={handleSocialInput}
                  value={socialLink?.title}
                />

                <InputBox
                  id="link"
                  label="social media link"
                  title="Add your social media"
                  allowInput={true}
                  overrideStyle={style?.linkInput}
                  onChange={handleSocialInput}
                  value={socialLink?.link}
                />
              </div>}
            
            {true &&
              <div onClick={() => setAddedInput(!addedInput)} style={{width: "40px", margin: "0 auto"}}>
                {allowInput &&
                !addedInput ? 
                  <SocialCard
                    overrideStyle={style.addMore}
                    icon={<BiPlusCircle style={{ width: "40px", height: "40px" }} />}
                  /> : 

                  allowInput &&
                  <SocialCard
                          overrideStyle={style.addMore}
                          icon={<BiCheckCircle style={{ width: "40px", height: "40px" }} />}
                          onClick={addSocialToProfile}
                  />
                }
              </div>}
          </div>
        }

        <div className={style.buttons}>
          <Button
            label="Cancel"
            className={style.button}
            onClick={() => navigate('/mutual')}
          />
          <Button 
            label="Save changes"
            className={style.button}
            onClick={ allowInput && updateProfile }
            style={allowInput ? { cursor: "pointer" } : { cursor: "not-allowed" }}
          />
        </div>
      </div>
    </div>
  ) : <Navigate to="/login" />;
}

export default Edit;