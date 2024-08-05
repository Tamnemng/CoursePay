import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import ClassEdit from './pages/ClassEdit/ClassEdit';
import Contact from './pages/Contact/Contact';
import CourseEdit from './pages/CourseEdit/CourseEdit';
import GeneralSubjectChange from './pages/GenaralSubjectChange/ClassChange';
import History from './pages/History/History';
import Improve from './pages/Improve/Improve';
import Logging from './pages/Logging/Logging';
import NoPage from './pages/NoPage/NoPage';
import Pay from './pages/Pay/Pay';
import Register from './pages/Register/Register';
import Registered from './pages/Registered/Registered';
import Specialized from './pages/Specialized/Specialized';
import TuitionChange from './pages/TuitionChange/TuitionChange';
import TuitionEdit from './pages/TuitionEdit/TuitionEdit';
import TuitionMain from './pages/tuitionMain/TuitionMain';
import MajorSubjectChange from '../src/pages/MajorSubjectChange/MajorSubjectChange'
import MajorSubjectChangeDetail from '../src/pages/MajorSubjectChange/detail/MajorSubjectChangeDetail'


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
          <Route path="/tuition/pay" element={<ProtectedRoute><RoleBasedRoute element={Pay} allowedRoles={['1']} /></ProtectedRoute>} />
          <Route path="/tuition/history" element={<ProtectedRoute><RoleBasedRoute element={History} allowedRoles={['1']} /></ProtectedRoute>} />
          <Route path="/courses/register/general" element={<ProtectedRoute><RoleBasedRoute element={Register} allowedRoles={['1']} /></ProtectedRoute>} />
          <Route path="/courses/register/specialized" element={<ProtectedRoute><RoleBasedRoute element={Specialized} allowedRoles={['1']} /></ProtectedRoute>} />
          <Route path="/courses/register/improve" element={<ProtectedRoute><RoleBasedRoute element={Improve} allowedRoles={['1']} /></ProtectedRoute>} />
          <Route path="/courses/registered" element={<ProtectedRoute><RoleBasedRoute element={Registered} allowedRoles={['1']} /></ProtectedRoute>} />
          <Route path="/contact" element={<ProtectedRoute><RoleBasedRoute element={Contact} allowedRoles={['1']} /></ProtectedRoute>} />

          {/* Routes for Employee (Role 2) */}
          <Route path="/majorSubjectChange" element={<ProtectedRoute><RoleBasedRoute element={MajorSubjectChange} allowedRoles={['2']} /></ProtectedRoute>} />
          <Route path="/majorSubjectChange/:id" element={<ProtectedRoute><RoleBasedRoute element={MajorSubjectChangeDetail} allowedRoles={['2']} /></ProtectedRoute>} />
          <Route path="/courseEdit" element={<ProtectedRoute><RoleBasedRoute element={CourseEdit} allowedRoles={['2']} /></ProtectedRoute>} />
          <Route path="/generalSubjectChange" element={<ProtectedRoute><RoleBasedRoute element={GeneralSubjectChange} allowedRoles={['2']} /></ProtectedRoute>} />
          <Route path="/classEdit" element={<ProtectedRoute><RoleBasedRoute element={ClassEdit} allowedRoles={['2']} /></ProtectedRoute>} />

          {/* Routes for Employee (Role 3) */}
          <Route path="/tuitionMain" element={<ProtectedRoute><RoleBasedRoute element={TuitionMain} allowedRoles={['3']}/></ProtectedRoute>}/>
          <Route path="/tuitionChange" element={<ProtectedRoute><RoleBasedRoute element={TuitionChange} allowedRoles={['3']} /></ProtectedRoute>} />
          <Route path="/tuitionEdit" element={<ProtectedRoute><RoleBasedRoute element={TuitionEdit} allowedRoles={['3']} /></ProtectedRoute>} />
          
          <Route path="*" element={<ProtectedRoute><NoPage role={role} /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}