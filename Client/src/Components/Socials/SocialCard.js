import style from '../../Views/MutualUsers/displayUser.module.css';
import instagramImg from '../../Assets/Images/instagram.svg';
import linkedInImg from '../../Assets/Images/linkedin.svg';
import facebookImg from '../../Assets/Images/facebook.svg';
import twitterImg from '../../Assets/Images/twitter.svg';
import webImg from '../../Assets/Images/web.svg';
import tiktokImg from '../../Assets/Images/tiktok.svg';
import youtubeImg from '../../Assets/Images/youtube.svg';
import discordImg from '../../Assets/Images/discord.svg';

import { ImBin } from 'react-icons/im';

const SocialCard = (props) => {
  let image = '';
  let description = props?.description?.toLowerCase();
  image = webImg;

  if (props.description) {
    if (description.includes("instagram"))
      image = instagramImg;
    else if (description.includes("linkedin"))
      image = linkedInImg;
    else if (description.includes("facebook"))
      image = facebookImg;
    else if (description.includes("twitter"))
      image = twitterImg;
    else if (description.includes("tiktok"))
      image = tiktokImg;
    else if (description.includes("youtube"))
      image = youtubeImg;
    else if (description.includes("discord"))
      image = discordImg;
  }

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
    <div className={style.socialCardWrap} style={{ justifyContent: props.binIcon ? "space-between" : "center" }}>
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

      {props.binIcon ?
        props.allowInput ?
          <ImBin
            style={{color: "red"}}
            size={"25px"}
            onClick={deleteSocial}
        /> : <ImBin
          style={{ color: "gray" }}
          size={"25px"}
        /> : ""}
    </div>
  );
}
 
export default SocialCard;