import { Link, useNavigate } from 'react-router-dom';
import getStartedImg from '../../Assets/Images/get-started.svg';
import networkingImg from '../../Assets/Images/students-networking.svg';
import Button from '../../Components/Button/Button';
import style from './home.module.css';

const Home = () => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  return (
    <>
      <div className={style.introDiv}>
        <div className={style.itemWrapper}>
          <img
            src={getStartedImg}
            className={style.getStartedImg}
            alt=""
          />
          <div className={style.getStartedContainer}>
            <h1>Get started with UniSocial</h1>
            <h3>Meet other like-minded individuals on our student oriented platform and start connecting today.</h3>
            <Button
              label={ token ? "Meet Students »" : "Create an Account »" }
              className={ style.button }
              onClick={ token ? () => navigate('/users/mutual') : () => navigate('/register') }
            />
          </div>
        </div>

        <div className={style.itemWrapper}>
          <div className={style.getStartedContainer}>
            <h1 className={style.getStartedTxt}>Network with Students</h1>
            <h3>
              Customize your profile to suit your persona and choose your favourite hobbies that best
              describe you. Other students with mutual hobbies will be matched with you allowing for a
              mutual acquaintance.
            </h3>
          </div>
          <img
            src={networkingImg}
            className={style.getStartedImg}
            alt=""
          />
        </div>
      </div>
    </>
  );
}
 
export default Home;