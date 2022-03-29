import style from '../../Views/MutualUsers/displayUser.module.css';
import instagramImg from '../../Assets/Images/instagram.svg';
import linkedInImg from '../../Assets/Images/linkedin.svg';
import facebookImg from '../../Assets/Images/facebook.svg';
import twitterImg from '../../Assets/Images/twitter.svg';
import webImg from '../../Assets/Images/web.svg';

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

  return (
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
  );
}
 
export default SocialCard;