import App from './App';
import Login from './components/Login/Login';
import Signup from './components/Signup/Signup';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import RequireAuth from './components/RequireAuth';
import Dashboard from './pages/Dashboard/Dashboard';

const routes = [
  {
    path: '/',
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: '/signup', element: <Signup /> },
      { path: '/login', element: <Login /> },
      { 
        path: '/dashboard',
        element: <RequireAuth />,
        children: [
          { path: '', element: <Dashboard /> }
        ]
      }
    ]
  }
];

export default routes;

// const routes = [
//   {
//     path: '/',
//     element: <App />,
//     errorElement: <ErrorPage />,
//     children: [
//       { path: '/signup', element: <Signup /> },
//       { path: '/login', element: <Login /> },
//       { 
//         element: <PersistLogin />,  
//         children: [
//           { 
//             path: '/dashboard',
//             element: <RequireAuth />,
//             children: [
//               { path: '', element: <Dashboard /> }
//             ]
//           }
//         ]
//       }
//     ]
//   }
// ];
