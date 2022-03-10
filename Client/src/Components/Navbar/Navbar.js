import navbar from './navbar.module.css';
import { Link } from 'react-router-dom';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { FaUserAlt } from 'react-icons/fa';

const Navbar = () => {
  return (
    <div className={navbar.navbar}>
      <Link to="/users/mutual" className={navbar.brandTitle}>UniSocial</Link>
      <div className={navbar.icons}>
        <Link className={navbar.iconLinks} to='#'>
          <BsFillChatDotsFill style={{width: '25px', height: '25px'}}/>
        </Link>
        <Link className={navbar.iconLinks} to='/profile/edit'>
          <FaUserAlt style={{width: '25px', height: '25px'}}/>
        </Link>
      </div>
      <div className={navbar.links}>
          <Link to="#">Chat</Link>
          <Link to="/profile/edit">Profile</Link>
      </div>
    </div>
  );
}
 
export default Navbar;