import { Link, useNavigate } from 'react-router-dom';
import getStartedImg from '../../Assets/Images/get-started.svg';
import networkingImg from '../../Assets/Images/students-networking.svg';
import peopleTalkingImg from '../../Assets/Images/people-talking.svg';
import Button from '../../Components/Button/Button';
import style from './home.module.css';
import waveImg from '../../Assets/Images/wave-small.svg';

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
          <div className={style.infoContainer}>
            <h1>Get started with UniSocial</h1>
            <h3>
              Meet other like-minded individuals on our student oriented platform and start connecting today.
              Create an account now to get started.
            </h3>
            <Button
              label={ token ? "Meet Students »" : "Create an Account »" }
              className={ style.button }
              onClick={ token ? () => navigate('/mutual') : () => navigate('/register') }
            />

            <p>
              Already have an account?
              <Link to="/login" style={{textDecoration: "none", color: "#df691a", fontWeight: "bold"}}>
              &nbsp; Log in
              </Link>
            </p>

          </div>
        </div>
        
        <img src={waveImg} alt="" className={style.waves} />

        <div className={`${style.itemWrapper} ${style.secondInfoWrapper}`}>
          <div className={style.infoContainer}>
            <h1 className={style.getStartedTxt}>Network with Students</h1>
            <h3>
              Customize your profile to suit your persona and choose your favourite hobbies that best
              describe you.
            </h3>
          </div>
          <img
            src={networkingImg}
            className={style.getStartedImg}
            alt=""
          />
        </div>

        <img src={waveImg} alt="" className={style.waves}/>

        <div className={style.itemWrapper}>
          <img
            src={peopleTalkingImg}
            className={`${style.getStartedImg} ${style.peopleTalking}`}
            alt=""
          />
          <div className={style.infoContainer}>
            <h1>User Preference Recommendations</h1>
            <h3>
              Only network with those that share your interests. Students with mutual hobbies will be
              recommended allowing for a mutual acquaintance.
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}
 
export default Home;