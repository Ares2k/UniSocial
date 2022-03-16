import Button from '../Components/Button/Button';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import style from './userProfile.module.css';
import Popup from '../Components/Popup/Popup';
import profileImg from '../Assets/Images/profiler.PNG';
import { FiEdit } from 'react-icons/fi';
import { FaCheckCircle } from 'react-icons/fa';

const UserProfile = () => {
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [hobbyPopup, setHobbyPopup] = useState(false);
  const [allowInput, setAllowInput] = useState(null);
  const [allowAccess, setAllowAccess] = useState(false);
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
    bio: ''
  });

  const navigate = useNavigate();
  const token = localStorage.getItem('token');
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

    // const updateStatus = await response.json();
    window.location.reload();
  }

  const handleChange = (e) => {
    const field = e.target.name
    const value = e.target.value;
    let course = {...profile.course}

    if(value === '') {
      console.log(`${field} cannot be empty`);
      setEmpty(true);
    } else {
      setEmpty(false);
    }

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

  useEffect(() => {
    if(!token) {
      console.log('No JWT token found. Please login again.');
      navigate('/login');
    }

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
          bio: user.bio
        };

        setProfile(profileObj);
        setError(false);
        setAllowAccess(true);
      } else {
        console.log(res);
        navigate('/login');
      }
    })
    .catch(err => {
      console.log(err);
    });
  }, [navigate])

  // Only render the page if a valid token exists
  return allowAccess ? (
    <div className={style.mainWrapper}>
      <div className={style.profileCard}>
        <div className={style.header}>
          { allowInput ?
            (<FaCheckCircle
              className={`${style.editIcon} ${style.headerWrapper}`}
              onClick={editBtnClick}          
            />) : (<FiEdit
              className={`${style.editIcon} ${style.headerWrapper}`}
              onClick={editBtnClick}
            />)
          }
          <h1 className={style.headerWrapper}>Your Profile</h1>
        </div>

        <div className={style.profileImageHolder}>
          <img src={profileImg} alt="" className={style.profileImg} />
          <Link
            to="#"
            style={{ color: "#df691a"}}
            className={style.changePic}>
            Click to change picture
          </Link>
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
            />
          </div>

          <div className={style.field}>
            <label>Email</label>
            <input
              id='email'
              name='email'
              value={profile?.email}
              placeholder='Email'
              type='email'
              autoComplete='off'
              onChange={handleChange}
              className={style.disabled}
              disabled={true}
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
            onClick={() => setHobbyPopup(true)}
            className={style.button}
          />

          <Button
            label='Save Changes'
            onClick={ updateProfile }
            className={style.button}
          />
        </div>
      </div>

      {hobbyPopup &&
        <Popup
          trigger={ hobbyPopup }
          setTrigger={ setHobbyPopup }
          profile={ profile }
          setProfile={ setProfile }
        />
      }

      { error && <h2>{error}</h2> }
      { empty && <h2>Cannot be empty</h2> }
    </div>
  ) : '';
}
 
export default UserProfile;