import style from './popup.module.css';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import { AiOutlineCloseCircle } from 'react-icons/ai';

const Popup = (props) => {
  const [hobbies, setHobbies] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);
  const [hobbyArray, setHobbyArray] = useState([]);

  useEffect(() => {
    const fetchHobbies = async () => {
      let hobbyList = await fetch('http://192.168.0.75:5000/api/hobbies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const { hobbies } = await hobbyList.json();
      setHobbies(hobbies);
    }
    fetchHobbies();

    const arrayOfHobbies = []
    const selectedArr = props.profile.hobbies.map(hobby => {
      arrayOfHobbies.push(hobby);
      return {
        value: hobby,
        label: hobby
      }
    });

    setSelectedHobbies(selectedArr);
    setHobbyArray(arrayOfHobbies);
  }, []);

  const handleChange = (e) => {
    const arrayOfHobbies = []
    const selectedArr = e.map(hobby => {
      arrayOfHobbies.push(hobby.label);
      return {
        label: hobby.label,
        value: hobby.value
      }
    })

    setSelectedHobbies(selectedArr);
    setHobbyArray(arrayOfHobbies);
  }

  return (props.trigger) ? (
    <div className={style.popup}>
      <div className={style.inner}>
        <AiOutlineCloseCircle
          className={style.close}
          onClick={() => {
            props.setTrigger(false);
            props.setProfile({
              ...props.profile,
              hobbies: hobbyArray
            })
            props.setSelected('links');
          }}
        />
        
        <div className={style.hobbies}>
          <Select
            tabIndex={0}
            isMulti
            options={hobbies}
            onChange={handleChange}
            className={style.select}
            value={selectedHobbies}
          />
        </div>
      </div>
    </div>
  ) : '';
}
 
export default Popup;