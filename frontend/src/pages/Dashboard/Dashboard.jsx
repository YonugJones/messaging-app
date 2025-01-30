import { Link } from 'react-router-dom';
import Users from '../../components/Users/Users';

const Dashboard = () => {
  return (
    <>
      <h1>Dashboard</h1>
      <p>You Are AUTHENTICATED</p>
      <Users />
      <Link to='/dashboard/1'>Page One</Link> <br />
      <Link to='/dashboard/2'>Page Two</Link>
    </>
  )
}

export default Dashboard; 