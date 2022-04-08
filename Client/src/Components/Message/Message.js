import { format } from 'timeago.js';
import style from './message.module.css';

const Message = ({message, own}) => {
  return (
    <div className={own ? style.messageOwn : style.message}>
      <div className={style.messageTop}>
        <img
          className={style.messageImg}
          src="https://images.pexels.com/photos/3686769/pexels-photo-3686769.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
          alt=""
        />
        <p className={style.messageText}>{message.text}</p>
      </div>

      <div className={style.timestamp}>
        {format(message.createdAt)}
      </div>
    </div>
  );
}
 
export default Message;