import Users from '../../components/Users/Users';
import ChatsList from '../../components/ChatsList/ChatsList';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className='dashboard-container'>
      <div className='dashboard-header'>
        <h1>Dashboard</h1>
      </div>
      <div className='dashboard-body'>
        <ChatsList />
        <Users />
      </div>
    </div>
  )
}

export default Dashboard; 