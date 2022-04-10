import navbar from './navbar.module.css';
import { Link } from 'react-router-dom';
import { BsFillChatDotsFill } from 'react-icons/bs';
import { FaUserAlt } from 'react-icons/fa';
import { ImUsers } from 'react-icons/im';
import { useContext } from 'react';
import { NavbarContext } from '../../App';
import { MdLogout } from 'react-icons/md';
import networkCircleImg from '../../Assets/Images/network-circle.png';

const Navbar = () => {
  const { navVal } = useContext(NavbarContext);

  const logout = () => {
    localStorage.removeItem('token');
  }

  return (
    <div className={navbar.navbar}>
      <div className={navbar.brandTitle}>
        <Link to="/home">
          UniS
          <img src={networkCircleImg} style={{ width: "35px", margin: "0 1px" }} alt="" />
          cial
        </Link>
      </div>

      <div className={navbar.icons}>
        <Link className={navbar.iconLinks} to='/mutual'>
          <ImUsers size={"30px"}/>
        </Link>

        <Link className={navbar.iconLinks} to='/chat'>
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
        <Link to="/chat">Chat</Link>
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