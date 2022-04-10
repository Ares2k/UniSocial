import arrowImg from '../../Assets/Images/right-arrow.png';
import style from './step.module.css';

const Step = ({ src, size, step, description, arrow }) => {
  return (
    <>
      <div className={style.eachStep}>
        <img src={src} alt="" style={{ width: size, height: size }} />
        <h2>Step {step}</h2>
        <p>{description}</p>
      </div>

      {arrow ? <img src={arrowImg} alt="" style={{ width: size, height: size }}/> : ""}
    </>
  );
}
 
export default Step;