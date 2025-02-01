import { Link } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
  return (
    <div className='error-page'> 
      <h1>You are in uncharted territories</h1>
      <p><Link to='/dashboard'>
        Click here to head back
      </Link></p>
    </div>
  );
};

export default ErrorPage;