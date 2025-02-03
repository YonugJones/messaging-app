import { faMessage, faUser } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import useAuth from '../../hooks/useAuth';
import axios from '../../api/axios';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const { auth, setAuth } = useAuth();

  const handleLogout = async () => {
    await axios.get('/logout', { withCredentials: true });
    setAuth(null);
  }

  return (
    <header className='header'>
      <div className='header-center'>
        <h1>Messaging App</h1>
        <FontAwesomeIcon icon={faMessage} className='icon' />
      </div>
      <div className='header-right'>
        { auth?.accessToken ? (
          <>
            <div className='header-right-1'>
              <FontAwesomeIcon icon={faUser} className='icon' />
              <Link to={`/dashboard/${auth?.id}`} className='profile-link'>
                {auth?.username}
              </Link>
            </div>
            <div className='header-right-2'>
              <button onClick={() => handleLogout()}>Logout</button>
            </div>
          </>
        ) : (
          <>
            <Link to='/login'>Login</Link>
            <Link to='/signup'>Signup</Link>
          </>
        ) }
      </div>
    </header>
  )
};

export default Header;