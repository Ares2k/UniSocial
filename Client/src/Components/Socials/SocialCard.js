import style from '../../Views/MutualUsers/displayUser.module.css';

const SocialCard = (props) => {
  return (
    <div className={style.socialCard}>
      <img src={props.image} alt="" className={style.socialIcons}/>
      <div className={style.socialDesc}>
        <p style={{fontWeight: "bold"}}>{props.title}</p>
        <p style={{color: "#df691a"}}>{props.description}</p>
      </div>
    </div>
  );
}
 
export default SocialCard;