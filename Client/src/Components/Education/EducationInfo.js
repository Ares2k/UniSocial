import style from '../../Views/MutualUsers/displayUser.module.css';

const EducationInfo = (props) => {
  return (
    <div className={style.courseInfo}>
      {props.icon}
      <p>{props.courseInfo || 'No information available'}</p>
    </div>
  );
}
 
export default EducationInfo;