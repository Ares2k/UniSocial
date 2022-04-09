import { format } from 'timeago.js';
import style from './message.module.css';
import ProfilePicture from '../ProfilePicture/ProfilePicture';

const Message = ({ message, own, active }) => {
  return (
    <div className={own ? style.messageOwn : style.message}>
      <div className={style.messageTop}>
        {!own &&
          <ProfilePicture 
            filename={active}
            imageContainer={style.profilePic}
          />}
        <p className={style.messageText}>{message.text}</p>
      </div>

      <div className={style.timestamp}>
        {format(message.createdAt)}
      </div>
    </div>
  );
}
 
export default Message;