import Button from '../Button/Button';
import style from './popup.module.css';
import { IoClose } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import Select from 'react-select';

const Popup = (props) => {
  // const [input, setInput] = useState('');
  const [hobbies, setHobbies] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  // let profileHobbies = [];
  // const [userHobbies, setUserHobbies] = useState([]);
  // let hobby = [];

  useEffect(() => {
    const fetchHobbies = async () => {
      let hobbyList = await fetch('http://localhost:5000/api/hobbies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const { hobbies } = await hobbyList.json();
      setHobbies(hobbies);

      // const userHobbies = props.profile.hobbies;
      // for(let i=0; i<userHobbies.length; i++) {
      //   profileHobbies.push({
      //     value: i,
      //     label: userHobbies[i]
      //   })
      // }
      // console.log(profileHobbies);
      // setSelectedHobbies(profileHobbies);
    }
    fetchHobbies();
  }, []);

  const handleChange = (e) => {
    // console.log(props.profile.hobbies);
    const selected = Array.isArray(e) ? e.map(hobby => hobby.label) : [];
    setSelectedHobbies(selected);
    // props.setHobbies(selected)
  }

  // const handleCheckBox = (e) => {
  //   if(e.target.checked) {
  //     setUserHobbies([...userHobbies, e.target.value]);
  //   } else {
  //     // console.log(e.target.value + ' needs to be removed');
  //     const checkBoxArr = userHobbies.filter((hobby) => {
  //       return (hobby !== e.target.value);
  //     });

  //     setUserHobbies(checkBoxArr);
  //   }

  //   console.log(userHobbies);
  // }

  // if(input.length > 0) {
  //   hobby = hobbies.filter((hobby) => {
  //     return hobby.hobby.toLowerCase().includes(input.toLowerCase())
  //   });
  // } else {
  //   hobby = hobbies;
  // }

  return (props.trigger) ? (
    <div className={style.popup}>
      <div className={style.inner}>
        <Button
          label={<IoClose style={{width: '15px', height: '15px'}}/>}
          className={style.close}
          onClick={() => {
            props.setTrigger(false);
            props.setProfile({
              ...props.profile,
              hobbies: selectedHobbies
            })
          }}
        />

        {/* <input
          id={style.hobbySearch}
          type='text'
          placeholder='Start typing a hobby...'
          onChange={ handleChange }
          value={ input }
        /> */}
        
        <div className={style.hobbies}>
          <Select
            isMulti
            options={hobbies}
            onChange={handleChange}
            className={style.select}/>
          {/* {hobby.map((hobby, index) => (
            <div key={index} className={style.hobby}>
              <input type="checkbox" onChange={handleCheckBox} value={ hobby.hobby }/>
              { hobby.hobby }
            </div>
          ))} */}
        </div>
      </div>
    </div>
  ) : '';
}
 
export default Popup;