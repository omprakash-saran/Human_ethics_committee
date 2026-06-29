import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/home/Home'
import About from './pages/about/About';
import Events from './pages/events/Events';
import Committee from './pages/committee/Committee';
import HumanEthics from './pages/humanEthics/HumanEthics';
import Applications from './pages/applications/Applications';
import Downloads from './pages/downloads/Downloads';
import Resources from './pages/resources/Resources';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AuthCallback from './pages/auth/AuthCallback';

  const App = () => {

    const router = createBrowserRouter(
      createRoutesFromElements(
        <Route path="" element={<Layout />}>
          <Route path="/" element={<Home/>} />
          <Route path="/about" element={<About/>} />
          <Route path="/events" element={<Events/>} />
          <Route path="/committee" element={<Committee/>} />
          <Route path="/human-ethics" element={<HumanEthics/>} />
          <Route path="/applications" element={<Applications/>} />
          <Route path="/auth/callback" element={<AuthCallback/>} />
          <Route path="/downloads" element={<Downloads/>} />
          <Route path="/resources" element={<Resources/>} />
          <Route path="/admin/login" element={<AdminLogin/>} />
          <Route path="/admin/dashboard" element={<AdminDashboard/>} />
        </Route>
      )
      );

      return <RouterProvider router = {router}/>;
  }

export default App
