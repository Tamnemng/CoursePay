import { useEffect, useState } from 'react';
import Logging from './pages/Logging/Logging';
import Home from './pages/Home/Home';
import NoPage from './pages/NoPage/NoPage';
import Pay from './pages/Pay/Pay';
import History from './pages/History/History';
import Register from './pages/Register/Register';
import Specialized from './pages/Specialized/Specialized';
import Improve from './pages/Improve/Improve';
import Registered from './pages/Registered/Registered';
import Contact from './pages/Contact/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import CourseChange from './pages/CourseChange/CourseChange';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

const useRoleListener = () => {
  const [role, setRole] = useState(() => localStorage.getItem('role') || '');

  useEffect(() => {
    const handleRoleChange = (event) => {
      const newRole = event.detail.toString();
      setRole(newRole);
    };

    window.addEventListener('roleChanged', handleRoleChange);

    return () => {
      window.removeEventListener('roleChanged', handleRoleChange);
    };
  }, []);

  return role;
};

export default function App() {
  const role = useRoleListener();

  useEffect(() => {
    const sessionTimeout = 1 * 60 * 1000;

    const updateLastActivityTime = () => {
      localStorage.setItem('lastActivityTime', new Date().getTime().toString());
    };

    const checkSessionTimeout = () => {
      const now = new Date().getTime();
      const lastActivityTime = localStorage.getItem('lastActivityTime');
      if (lastActivityTime && now - lastActivityTime > sessionTimeout) {
        localStorage.setItem('isAuthenticated', 'false');
        localStorage.removeItem('role');
      }
    };

    const events = ['load', 'mousemove', 'mousedown', 'click', 'scroll', 'keypress'];
    events.forEach(event => window.addEventListener(event, updateLastActivityTime));
    
    const intervalId = setInterval(checkSessionTimeout, 60000); // Check every minute

    return () => {
      events.forEach(event => window.removeEventListener(event, updateLastActivityTime));
      clearInterval(intervalId);
    };
  }, []);

  const RoleBasedRoute = ({ element: Element, allowedRoles }) => {
    return allowedRoles.includes(role) ? <Element /> : <Navigate to="/unauthorized" replace />;
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Logging />} />

          {/* Routes for Students (Role 1) */}
          <Route path="/home" element={<ProtectedRoute><RoleBasedRoute element={Home} allowedRoles={['1']} /></ProtectedRoute>} />
          <Route path="/tuition/pay" element={<ProtectedRoute><RoleBasedRoute element={Pay} allowedRoles={['1']} /></ProtectedRoute>} />
          <Route path="/tuition/history" element={<ProtectedRoute><RoleBasedRoute element={History} allowedRoles={['1']} /></ProtectedRoute>} />
          <Route path="/courses/register/general" element={<ProtectedRoute><RoleBasedRoute element={Register} allowedRoles={['1']} /></ProtectedRoute>} />
          <Route path="/courses/register/specialized" element={<ProtectedRoute><RoleBasedRoute element={Specialized} allowedRoles={['1']} /></ProtectedRoute>} />
          <Route path="/courses/register/improve" element={<ProtectedRoute><RoleBasedRoute element={Improve} allowedRoles={['1']} /></ProtectedRoute>} />
          <Route path="/courses/registered" element={<ProtectedRoute><RoleBasedRoute element={Registered} allowedRoles={['1']} /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><RoleBasedRoute element={Contact} allowedRoles={['1']} /></ProtectedRoute>} />

          {/* Routes for Students (Role 2) */}
          <Route path="/courseChange" element={<ProtectedRoute><RoleBasedRoute element={CourseChange} allowedRoles={['2']} /></ProtectedRoute>} />

          <Route path="*" element={<ProtectedRoute><NoPage role={role} /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}