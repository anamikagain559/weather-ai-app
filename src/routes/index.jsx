import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import Home from '../pages/Home';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Subscription from '../pages/Subscription';
import Developer from '../pages/Developer';
import SmsDashboard from '../pages/SmsDashboard';
import Forestry from '../pages/Forestry';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentCancel from '../pages/PaymentCancel';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/register',
        element: <Register />,
      },
      {
        path: '/subscription',
        element: <Subscription />,
      },
      {
        path: '/developer',
        element: <Developer />,
      },
      {
        path: '/sms',
        element: <SmsDashboard />,
      },
      {
        path: '/forestry',
        element: <Forestry />,
      },
      {
        path: '/success',
        element: <PaymentSuccess />,
      },
      {
        path: '/cancel',
        element: <PaymentCancel />,
      },
    ],
  },
]);
