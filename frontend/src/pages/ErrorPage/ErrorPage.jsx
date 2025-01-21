import { Link } from 'react-router-dom';
import './ErrorPage.css';

const ErrorPage = () => {
  return (
    <div className='error-page'> 
      <h1>You are in uncharted territories</h1>
      <Link to='/'>
        Click here to head back to the homepage
      </Link>
    </div>
  );
};

export default ErrorPage;