import navbar from './navbar.module.css';
import { Link } from 'react-router-dom';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { FaUserAlt } from 'react-icons/fa';
import { ImUsers } from 'react-icons/im';

const Navbar = () => {
  return (
    <div className={navbar.navbar}>
      <Link to="/home" className={navbar.brandTitle}>UniSocial</Link>

      <div className={navbar.icons}>
        <Link className={navbar.iconLinks} to='/mutual'>
          <ImUsers style={{width: '30px', height: '30px'}}/>
        </Link>

        <Link className={navbar.iconLinks} to='#'>
          <BsFillChatDotsFill style={{width: '30px', height: '30px'}}/>
        </Link>

        <Link className={navbar.iconLinks} to='/profile/edit'>
          <FaUserAlt size={"30px"}/>
        </Link>
      </div>

      <div className={navbar.links}>
          <Link to="/mutual">Meet Students</Link>
          <Link to="#">Chat</Link>
          <Link to="/profile/edit">Profile</Link>
      </div>
    </div>
  );
}
 
export default Navbar;