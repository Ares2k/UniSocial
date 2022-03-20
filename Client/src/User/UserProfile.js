import Button from '../Components/Button/Button';
import { useNavigate, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import style from './userProfile.module.css';
import Popup from '../Components/Popup/Popup';
import { FiEdit } from 'react-icons/fi';
import anonImg from '../Assets/Images/anon.jpg';
import { BsFillCameraFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UserProfile = () => {
  const [hobbyPopup, setHobbyPopup] = useState(false);
  const [allowInput, setAllowInput] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
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
    filename: ''
  });
  const [error, setError] = useState(profile);
  const navigate = useNavigate();
  let inputClass = allowInput ? style.enabled : style.disabled;

  const updateProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://192.168.0.74:5000/api/profile', {
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

  // const handleChange = (e) => {
  //   setInput({
  //     ...input,
  //     [e.target.id]: e.target.value
  //   });

    // e.target.value ? 
    //   setError({
    //     ...error,
    //     [e.target.id + "Err"]: ""
    //   }) : setError({
    //     ...error,
    //     [e.target.id + "Err"]: `${e.target.placeholder} required`
    //   })
  // }

  const handleChange = (e) => {
    const field = e.target.name
    const value = e.target.value;
    let course = {...profile.course}

    value ? 
      setError({
        ...error,
        [e.target.id + "Err"]: ""
      }) : setError({
        ...error,
        [e.target.id + "Err"]: `${e.target.placeholder} required`
      }) 

    if(field === 'code' || field === 'name' || field === 'year') {
      if(field === 'year') 
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

  const fileSelected = async (e) => {
    const image = e.target.files[0];

    const formData = new FormData();
    formData.append("image", image);

    await fetch('http://192.168.0.74:5000/api/images', {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: formData
    });

    window.location.reload();

    // setFile(image);
  }

  useEffect(() => {
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
      if(res.status === 200) {
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
          filename: user.filename
        };

        return isMounted ? (
          setProfile(profileObj)
        ) : null;
      } else {
        localStorage.removeItem('token');
        return isMounted ? setToken(null) : null;
      }
    })
    .catch(err => {
      console.log(err);
    });

    return () => isMounted = false;
  }, [navigate])

  // Only render the page if a valid token exists
  return token ? (
    <div className={style.mainWrapper}>
      <div className={style.profileCard}>
        <div className={style.header}>
          { !allowInput &&
            (<FiEdit
              className={`${style.editIcon} ${style.headerWrapper}`}
              onClick={editBtnClick}
            />)
          }
          <h1 className={style.headerWrapper}>Your Profile</h1>
        </div>

        <div className={style.profileImageHolder}>
          <div className={style.imageBorder}>
            { profile.filename ? 
              <img
                src={`/api/images/${profile.filename}`}
                alt=""
                className={style.profileImg}
              />
              :
              <img
                src={anonImg}
                alt=""
                className={style.profileImg}
              />
            }
          </div>
          
          <label htmlFor='fileUpload' className={style.fileLabel}>
            <BsFillCameraFill
              className={style.cameraIcon}
            />
          </label>
          <input
            id='fileUpload'
            type='file'
            accept='image/png, image/jpeg'
            onChange={fileSelected}
          />
        </div>
        
        <div className={style.signupDetails}>
          <div className={style.field}>
            <label>Username</label>
            <input
              id='username'
              className={style.username}
              name='username'
              value={ profile?.username }
              disabled={true}
              style={{cursor: "not-allowed"}}
            />
          </div>

          <div className={style.field}>
            <label>Email</label>
            <input
              id='email'
              name='email'
              value={ profile?.email }
              placeholder='Email'
              type='email'
              autoComplete='off'
              onChange={handleChange}
              className={style.disabled}
              disabled={true}
              style={{cursor: "not-allowed"}}
            />
          </div>
        </div>

        <div className={style.fullname}>
          <div className={style.field}>
            <label>First Name</label>
            <input
              id='firstname'
              name='firstname'
              value={ profile?.firstname }
              placeholder='First name'
              type='text'
              autoComplete='off'
              onChange={ handleChange }
              className={ inputClass }
              disabled={ allowInput ? false : true }
            />
          </div>

          <div className={style.field}>
            <label>Surname</label>
            <input
              id='surname'
              name='surname'
              value={ profile?.surname }
              placeholder='Surname'
              type='text'
              autoComplete='off'
              onChange={ handleChange }
              className={ inputClass }
              disabled={ allowInput ? false : true }
            />
          </div>
        </div>
        
        <div className={style.field}>
          <label>Course Name</label>
          <input
            id='courseName'
            name='name'
            value={ profile?.course?.name }
            placeholder='Course Name'
            type='text'
            autoComplete='off'
            onChange={ handleChange }
            className={ inputClass }
            disabled={ allowInput ? false : true }
          />
        </div>
        
        <div className={style.field}>
          <label>Course Code & Year</label>
          <div className={style.courseDetails}>
            <input
              id='courseCode'
              name='code'
              value={ profile?.course?.code }
              placeholder='Course Code'
              type='text'
              autoComplete='off'
              onChange={ handleChange }
              className={ inputClass }
              disabled={ allowInput ? false : true }
            />

            <select
              id='courseYear'
              name='year'
              value={ profile?.course?.year }
              onChange = { handleChange }
              className={ inputClass }
              disabled={ allowInput ? false : true }>

              <option value='1'>1</option>
              <option value='2'>2</option>
              <option value='3'>3</option>
              <option value='4'>4</option>
              <option value='5'>5</option>
            </select>
          </div>
        </div>

        <div className={style.field}>
          <label>Say something about yourself</label>
          <textarea
            id='bio'
            name='bio'
            value={ profile?.bio }
            placeholder='Describe yourself'
            type='text'
            autoComplete='off'
            onChange={ handleChange }
            className={ inputClass }
            disabled={ allowInput ? false : true }
          />
        </div>

        <div className={style.buttonHolder}>
          <Button
            label='Hobbies'
            onClick={() => allowInput && setHobbyPopup(true)}
            className={style.button}
            style={ allowInput ? {cursor: "pointer"} : {cursor: "not-allowed"}}
          />

          <Button
            label='Save Changes'
            onClick={ allowInput && updateProfile }
            className={style.button}
            style={ allowInput ? {cursor: "pointer"} : {cursor: "not-allowed"}}
          />
        </div>
      </div>

      { hobbyPopup &&
        <Popup
          trigger={ hobbyPopup }
          setTrigger={ setHobbyPopup }
          profile={ profile }
          setProfile={ setProfile }
        />
      }
    </div>
  ) : <Navigate to="/login"/>;
}
 
export default UserProfile;