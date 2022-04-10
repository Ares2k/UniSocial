import { Link, useNavigate } from 'react-router-dom';
import getStartedImg from '../../Assets/Images/get-started.svg';
import networkingImg from '../../Assets/Images/students-networking.svg';
import peopleTalkingImg from '../../Assets/Images/people-talking.svg';
import Button from '../../Components/Button/Button';
import style from './home.module.css';
import waveImg from '../../Assets/Images/wave-small.svg';
import { useContext, useEffect } from 'react';
import { NavbarContext } from '../../App';
import signupImg from '../../Assets/Images/signup.png';
import editProfileImg from '../../Assets/Images/editProfile1.png';
import networkImg from '../../Assets/Images/networking.png';
import chatImg from '../../Assets/Images/chat.png';
import Step from '../../Components/Steps/Step';
import lightbulbImg from '../../Assets/Images/lightbulb.png';

const Home = () => {
  document.title = 'Welcome to UniSocial';
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { setNavVal } = useContext(NavbarContext);
  const tutorialSteps = [
    {
      src: signupImg,
      size: "50px",
      step: 1,
      description: "Create an account, it's free.", 
      arrow: true
    },
    {
      src: editProfileImg,
      size: "50px",
      step: 2,
      description: "Customize your profile to best describe you.",
      arrow: true
    },
    {
      src: networkImg,
      size: "50px",
      step: 3,
      description: "Find other similar minded students.",
      arrow: true
    },
    {
      src: chatImg,
      size: "50px",
      step: 4,
      description: "Start chatting and grow your network.",
    }
  ]
  
  useEffect(() => {
    let isMounted = true;

    if (isMounted) {
      setNavVal(null);
    }

    return () => isMounted = false;
  },[setNavVal])

  const size = "50px";

  return (
    <>
      <div className={style.introDiv}>
        <div className={style.itemWrapper}>
          <div className={style.steps}>
            {tutorialSteps.map((s, index) => (
              <Step 
                key={index}
                src={s.src}
                size={s.size}
                step={s.step}
                description={s.description}
                arrow={s.arrow}
              />
            ))}
          </div>

          <img
            src={getStartedImg}
            className={style.getStartedImg}
            alt=""
          />
          <div className={style.infoContainer}>
            <h1 className={style.h1Tag}>Get started with UniSocial</h1>
            <h3>
              Meet other like-minded individuals on our student oriented platform and start connecting today.
              Create an account now to get started.
            </h3>
            <Button
              label={ token ? "Meet Students »" : "Create an Account »" }
              className={ style.button }
              onClick={ token ? () => navigate('/mutual') : () => navigate('/register') }
            />

            {!token &&
            <p>
              Already have an account?
              <Link to="/login" style={{textDecoration: "none", color: "#df691a", fontWeight: "bold"}}>
              &nbsp; Log in
              </Link>
            </p>}

          </div>
        </div>
        
        <img src={waveImg} alt="" className={style.waves} />

        <div className={`${style.itemWrapper} ${style.secondInfoWrapper}`}>
          <div className={style.infoContainer}>
            <h1 style={{marginTop: "20px"}} className={style.h1Tag}>Network with Students</h1>
            <h3>
              Customize your profile to suit your persona and choose interests that best
              describe you. Use our integrated chat to get acquainted and/or link your socials so that
              you can be reached.
            </h3>
            
            <div className={style.factWrapper}>
              <div className={style.fact}>
                <img src={lightbulbImg} alt="" style={{width: size, height: size}}/>
                <p>Did you know?</p>
              </div>
              <p className={style.factDesc}>
                20%-25% of university students drop out due to stresses related to college?
                Communication amongst students partially contributes to this statistic.
                UniSocial aims to alleviate this issue by providing students a platform
                where they can get acquainted based on similar interests.
              </p>
            </div>

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
            <h1 className={style.h1Tag}>Interest based matching</h1>
            <h3>
              Only network with those that share your interests. Students with mutual interests will be
              displayed allowing for a mutual acquaintance.
            </h3>
          </div>
        </div>
      </div>
    </>
  );
}
 
export default Home;