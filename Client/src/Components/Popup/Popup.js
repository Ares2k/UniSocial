import Button from '../Button/Button';
import style from './popup.module.css';
import { IoClose } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import Select from 'react-select';

const Popup = (props) => {
  const [hobbies, setHobbies] = useState([]);
  const [selectedHobbies, setSelectedHobbies] = useState([]);

  useEffect(() => {
    const fetchHobbies = async () => {
      let hobbyList = await fetch('http://192.168.0.74:5000/api/hobbies', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      const { hobbies } = await hobbyList.json();
      setHobbies(hobbies);
    }
    fetchHobbies();
  }, []);

  const handleChange = (e) => {
    const selected = Array.isArray(e) ? e.map(hobby => hobby.label) : [];
    setSelectedHobbies(selected);
  }

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
        
        <div className={style.hobbies}>
          <Select
            isMulti
            options={hobbies}
            onChange={handleChange}
            className={style.select}/>
        </div>
      </div>
    </div>
  ) : '';
}
 
export default Popup;