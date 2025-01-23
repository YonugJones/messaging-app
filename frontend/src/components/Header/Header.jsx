import { faMessage } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const Header = () => {
  return (
    <header className='header'>
      <h1>Messaging App</h1>
      <FontAwesomeIcon icon={faMessage} />
    </header>
  )
};

export default Header;