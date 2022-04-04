import style from '../../Views/MutualUsers/displayUser.module.css';
import instagramImg from '../../Assets/Images/instagram.svg';
import linkedInImg from '../../Assets/Images/linkedin.svg';
import facebookImg from '../../Assets/Images/facebook.svg';
import twitterImg from '../../Assets/Images/twitter.svg';
import webImg from '../../Assets/Images/web.svg';
import { ImBin } from 'react-icons/im';

const SocialCard = (props) => {
  let image = '';
  
  if (props.description && props.description.toLowerCase().includes("instagram"))
    image = instagramImg;
  else if (props.description && props.description.toLowerCase().includes("linkedin"))
    image = linkedInImg;
  else if (props.description && props.description.toLowerCase().includes("facebook"))
    image = facebookImg;
  else if (props.description && props.description.toLowerCase().includes("twitter"))
    image = twitterImg;
  else
    image = webImg;

  const deleteSocial = () => {
    const idx = props.counter;
    const socials = props.profile.socials;

    socials.splice(idx, 1);

    props.setProfile({
      ...props.profile,
      socials: [...socials]
    });
  }

  return (
    <div className={style.socialCardWrap}>
      <div
        className={props.overrideStyle || style.socialCard}
        key={props.counter}
        onClick={props.onClick}
      >
        {props.description ? <img src={image} alt="" className={style.socialIcons}/> : props.icon}
        <div className={style.socialDesc}>
          <p style={{fontWeight: "bold"}}>{props.title}</p>
          <p style={{color: "#df691a", fontSize: "15px"}}>{props.description}</p>
        </div>
      </div>

      {props.binIcon &&
        props.allowInput ?
          <ImBin
            style={{color: "red"}}
            size={"25px"}
            onClick={deleteSocial}
        /> : <ImBin
          style={{ color: "gray" }}
          size={"25px"}
        />
      }
    </div>
  );
}
 
export default SocialCard;