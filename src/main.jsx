import { createRoot } from 'react-dom/client'
import './index.css'
import Login from './pages/Login.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import { Provider } from 'react-redux'
import store from './store/store.js'
import Protected from './components/AuthLayout.jsx'


const router = createBrowserRouter([
  {
    path:"/login",
    element:<Login />
  },
  {
    path:"/",
    element:<Protected>
      <Dashboard />
    </Protected>
  }
])

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router}/>
  </Provider>
)
