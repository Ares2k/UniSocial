import anonImg from '../../Assets/Images/anon.jpg';
import style from './profilePic.module.css';

const ProfilePicture = (props) => {
  const filename = props?.filename ? (
    `/api/images/${props.filename}`
  ) : ( anonImg );

  return (
    <div className={props.imageContainer}>
      <img
        src={filename}
        alt=""
        className={style.image}
      />
    </div>
  );
}
 
export default ProfilePicture;