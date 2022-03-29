import { AiOutlineLink } from "react-icons/ai";
import style from '../../Views/MutualUsers/displayUser.module.css';

const LinkHeader = (props) => {
  return (
    <div
      key={props.id}
      className={`${style.socials} ${props.selected === props.id && style.selected}`}
      style={{ cursor: "pointer" }}
      onClick={props.onClick}
      id={props.id}
    >
      {props.icon}
      <span>{props.title}</span>
    </div>
  );
}
 
export default LinkHeader;