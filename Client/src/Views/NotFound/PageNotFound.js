import { useNavigate } from 'react-router-dom';
import errorImg from '../../Assets/Images/error.svg';
import Button from '../../Components/Button/Button';
import style from './errorPage.module.css';

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={style.error}>
      <img src={errorImg} alt=""/>
      <h1>The page you're trying to visit doesn't exist.</h1>
      <Button
        label={"Home Page"}
        className={style.button}
        onClick={() => navigate('/home')}
      />
    </div>
  );
}
 
export default PageNotFound;