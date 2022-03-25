import anonImg from '../../Assets/Images/anon.jpg';

const ProfilePicture = (props) => {
  const filename = props?.filename ? (
    `/api/images/${props.filename}`
  ) : ( anonImg );

  return (
    <img
      src={filename}
      alt=""
      className={props.className}
    />
  );
}
 
export default ProfilePicture;