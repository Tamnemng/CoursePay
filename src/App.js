import { useEffect } from 'react';
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
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function App() {
  useEffect(() => {
    const sessionTimeout = 1 * 60 * 1000;
    const now = new Date().getTime();

    const lastActivityTime = localStorage.getItem('lastActivityTime');
    if (lastActivityTime && now - lastActivityTime > sessionTimeout) {
      localStorage.setItem('isAuthenticated', 'false');
    }

    const updateLastActivityTime = () => {
      localStorage.setItem('lastActivityTime', now.toString());
    };

    window.addEventListener('load', updateLastActivityTime);
    window.addEventListener('mousemove', updateLastActivityTime);
    window.addEventListener('mousedown', updateLastActivityTime);
    window.addEventListener('click', updateLastActivityTime);
    window.addEventListener('scroll', updateLastActivityTime);
    window.addEventListener('keypress', updateLastActivityTime);

    return () => {
      window.removeEventListener('load', updateLastActivityTime);
      window.removeEventListener('mousemove', updateLastActivityTime);
      window.removeEventListener('mousedown', updateLastActivityTime);
      window.removeEventListener('click', updateLastActivityTime);
      window.removeEventListener('scroll', updateLastActivityTime);
      window.removeEventListener('keypress', updateLastActivityTime);
    };
  }, []);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={<Logging />}
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tuition/pay"
            element={
              <ProtectedRoute>
                <Pay />
              </ProtectedRoute>}
          />
          <Route
            path="/tuition/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/register/general"
            element={
              <ProtectedRoute>
                <Register />
              </ProtectedRoute>}
          />
          <Route
            path="/courses/register/specialized"
            element={
              <ProtectedRoute>
                <Specialized />
              </ProtectedRoute>}
          />
          <Route
            path="/courses/register/improve"
            element={
              <ProtectedRoute>
                <Improve />
              </ProtectedRoute>}
          />
          <Route
            path="/courses/registered"
            element={
              <ProtectedRoute>
                <Registered />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <Contact />
              </ProtectedRoute>
            }
          />
          <Route
            path="*"
            element={
              <ProtectedRoute>
                <NoPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
