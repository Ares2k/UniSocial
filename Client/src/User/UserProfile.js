import Button from '../Components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import style from './userProfile.module.css';
import Popup from '../Components/Popup/Popup';

const UserProfile = () => {
  const [error, setError] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [hobbyPopup, setHobbyPopup] = useState(false);
  // const [chosenHobbies, setChosenHobbies] = useState([]);
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

  const updateProfile = async () => {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
      },
      body: JSON.stringify({
        profile
      })
    });

    const updateStatus = await response.json();
    console.log(updateStatus);
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

      setProfile({...profile,
        course
      });
      return;
    }

    setProfile({...profile,
      [field]: value,
    });  
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(!token) {
      console.log('No JWT token found. Please login again.');
      navigate('/login');
    }

    async function fetchProfile() {
      try {
        const response = await fetch('http://localhost:5000/api/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }});

        const userProfile = await response.json();

        // Destructure data from response object
        const {
          username,
          firstname,
          surname,
          email,
          course: { code, name, year },
          hobbies,
          bio 
        } = userProfile.user;

        // Construct profile object
        const profileObj = {
          username,
          firstname,
          surname,
          email,
          course: {
            code,
            name,
            year
          },
          hobbies,
          bio
        };

        setProfile(profileObj);
        // setChosenHobbies(hobbies);
        setError(false);
      } catch (error) {
        setError(error);
      }
    }
    fetchProfile();
  }, [navigate])

  return (
    <div className={style.profileCard}>
      <label>Username</label>
      <input
        id='username'
        className={style.username}
        name='username'
        value={ profile?.username }
        disabled={true}
      />

      <label>First Name</label>
      <input
        id='firstname'
        name='firstname'
        value={ profile?.firstname }
        placeholder='First name'
        type='text'
        autoComplete='off'
        onChange={ handleChange }
      />

      <label>Surname</label>
      <input
        id='surname'
        name='surname'
        value={ profile?.surname }
        placeholder='Surname'
        type='text'
        autoComplete='off'
        onChange={ handleChange }
      />

      <label>Email</label>
      <input
        id='email'
        name='email'
        value={ profile?.email }
        placeholder='Email'
        type='email'
        autoComplete='off'
        onChange={ handleChange }
      />

      <label>Course Name</label>
      <input
        id='courseName'
        name='name'
        value={profile?.course?.name}
        placeholder='Course Name'
        type='text'
        autoComplete='off'
        onChange={handleChange}
      />

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
        />

        <select
          id='courseYear'
          name='year'
          value={ profile?.course?.year }
          onChange = { handleChange }>

          <option value='1'>1</option>
          <option value='2'>2</option>
          <option value='3'>3</option>
          <option value='4'>4</option>
          <option value='5'>5</option>
        </select>
      </div>

      <label>Say something about yourself</label>
      <textarea
        id='bio'
        name='bio'
        value={ profile?.bio }
        type='text'
        autoComplete='off'
        onChange={ handleChange }
      />

      <div className={style.buttons}>
        <Button
          label='Hobbies'
          onClick={() => setHobbyPopup(true)}
        />

        <Button
          label='Save Changes'
          onClick={updateProfile}
        />
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
  );
}
 
export default UserProfile;