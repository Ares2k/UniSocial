import navbar from './navbar.module.css';
import { Link } from 'react-router-dom';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { FaUserAlt } from 'react-icons/fa';
import { ImUsers } from 'react-icons/im';
import { useContext } from 'react';
import { NavbarContext } from '../../App';
import { MdLogout } from 'react-icons/md';

const Navbar = () => {
  const { navVal } = useContext(NavbarContext);

  const logout = () => {
    localStorage.removeItem('token');
  }

  return (
    <div className={navbar.navbar}>
      <Link to="/home" className={navbar.brandTitle}>UniSocial</Link>

      <div className={navbar.icons}>
        <Link className={navbar.iconLinks} to='/mutual'>
          <ImUsers size={"30px"}/>
        </Link>

        <Link className={navbar.iconLinks} to='#'>
          <BsFillChatDotsFill size={"30px"}/>
        </Link>

        <Link
          className={navbar.iconLinks}
          to={!navVal && '/profile/edit'}
          onClick={navVal && logout}
        >
          {navVal ? <MdLogout size={"35px"}/> : <FaUserAlt size={"30px"}/>}
        </Link>
      </div>

      <div className={navbar.links}>
        <Link to="/mutual">Meet Students</Link>
        <Link to="#">Chat</Link>
        <Link
          to={!navVal && "/profile/edit"}
          onClick={navVal && logout}
        >
          {navVal || "Profile"}
        </Link>
      </div>
    </div>
  );
}
 
export default Navbar;