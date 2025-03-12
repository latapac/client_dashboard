import { createRoot } from 'react-dom/client';
import './index.css';
import Login from './pages/Login.jsx';
import { createHashRouter, RouterProvider } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import { Provider } from 'react-redux';
import store from './store/store.js';
import Protected from './components/AuthLayout.jsx';
import MachineList from './pages/Dashboard/components/MachineList.jsx';
import MachindeData from './pages/Dashboard/components/MachindeData.jsx';

const router = createHashRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <Protected>
        <Dashboard />
      </Protected>
    ),
    children: [
      {
        path: '/',
        element: <MachineList />,
      },
      {
        path: '/data',
        element: <MachindeData />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);