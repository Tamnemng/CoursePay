import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import ClassEdit from "./pages/ClassEdit/ClassEdit";
import Contact from "./pages/Contact/Contact";
import CourseEdit from "./pages/CourseEdit/CourseEdit";
import GeneralSubjectChange from "./pages/GenaralSubjectChange/ClassChange";
import History from "./pages/History/History";

import Logging from "./pages/Logging/Logging";
import NoPage from "./pages/NoPage/NoPage";
import Pay from "./pages/Pay/Pay";

import Registered from "./pages/Registered/Registered";
import TuitionMajor from "./pages/TuitionMajor/TuitionMajor";
import Specialized from "./pages/Specialized/Specialized";
import Register from "./pages/Register/Register";
import Improve from "./pages/Improve/Improve";
import TuitionEdit from "./pages/TuitionEdit/TuitionEdit";
import TuitionMain from "./pages/tuitionMain/TuitionMain";
import MajorSubjectChange from "./pages/MajorSubjectChange";
import MajorSubjectChangeDetail from "./pages/MajorSubjectChange/detail";
import CreateSubject from "./pages/CreateSubject";
import GeneralSubjectChangeDetail from "./pages/GenaralSubjectChange/detail";
import { getUserRole } from "./pages/Logging/loggingData";

const useRoleListener = () => {
  const [role, setRole] = useState(() => localStorage.getItem("role") || "");

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const userInfo = await getUserRole();
        setRole(userInfo?.role || "");
      } catch (error) {
        console.error("Error fetching role:", error);
        setRole("");
      }
    };

    fetchRole();

    const handleStorageChange = () => {
      const updatedRole = localStorage.getItem('role') || '';
      setRole(updatedRole);
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return role;
};

const userInfo = await getUserRole();

export default function App() {
  const role = useRoleListener();
  // const role = userInfo?.role || "";


  useEffect(() => {
    const sessionTimeout = 1 * 60 * 1000;

    const updateLastActivityTime = () => {
      localStorage.setItem("lastActivityTime", new Date().getTime().toString());
    };

    const checkSessionTimeout = () => {
      const now = new Date().getTime();
      const lastActivityTime = localStorage.getItem("lastActivityTime");
      if (lastActivityTime && now - lastActivityTime > sessionTimeout) {
        localStorage.setItem("isAuthenticated", "false");
        localStorage.removeItem("role");
      }
    };

    const events = [
      "load",
      "mousemove",
      "mousedown",
      "click",
      "scroll",
      "keypress",
    ];
    events.forEach((event) =>
      window.addEventListener(event, updateLastActivityTime)
    );

    const intervalId = setInterval(checkSessionTimeout, 60000); // Check every minute

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, updateLastActivityTime)
      );
      clearInterval(intervalId);
    };
  }, []);

  const RoleBasedRoute = ({ element: Element, allowedRoles }) => {
    console.log("Role in RoleBasedRoute:", role);
    console.log("Allowed Roles:", allowedRoles);
  
    // Chuyển đổi role và allowedRoles về kiểu dữ liệu số
    const roleNumber = Number(role);
    const allowedRolesNumbers = allowedRoles.map(role => Number(role));
  
    return allowedRolesNumbers.includes(roleNumber) ? (
      <Element />
    ) : (
      <Navigate to="/unauthorized" replace />
    );
  };

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route index element={<Logging />} />

          {/* Routes for Students (Role 1) */}
          <Route
            path="/tuition/pay"
            element={
              <ProtectedRoute>
                <RoleBasedRoute element={Pay} allowedRoles={["1"]} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tuition/history"
            element={
              <ProtectedRoute>
                <RoleBasedRoute element={History} allowedRoles={["1"]} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/register/specialized"
            element={
              <ProtectedRoute>
                <RoleBasedRoute element={Specialized} allowedRoles={["1"]} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/register/general"
            element={
              <ProtectedRoute>
                <RoleBasedRoute element={Register} allowedRoles={["1"]} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/register/improve"
            element={
              <ProtectedRoute>
                <RoleBasedRoute element={Improve} allowedRoles={["1"]} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courses/registered"
            element={
              <ProtectedRoute>
                <RoleBasedRoute element={Registered} allowedRoles={["1"]} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contact"
            element={
              <ProtectedRoute>
                <RoleBasedRoute element={Contact} allowedRoles={["1"]} />
              </ProtectedRoute>
            }
          />

          {/* Routes for Employee (Role 2) */}
          <Route
            path="/majorSubjectChange"
            element={
              <ProtectedRoute>
                <RoleBasedRoute
                  element={MajorSubjectChange}
                  allowedRoles={["2"]}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/majorSubjectChange/:id"
            element={
              <ProtectedRoute>
                <RoleBasedRoute
                  element={MajorSubjectChangeDetail}
                  allowedRoles={["2"]}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/courseEdit"
            element={
              <ProtectedRoute>
                <RoleBasedRoute element={CourseEdit} allowedRoles={["2"]} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generalSubjectChange"
            element={
              <ProtectedRoute>
                <RoleBasedRoute
                  element={GeneralSubjectChange}
                  allowedRoles={["2"]}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generalSubjectChange/:id"
            element={
              <ProtectedRoute>
                <RoleBasedRoute
                  element={GeneralSubjectChangeDetail}
                  allowedRoles={["2"]}
                />
              </ProtectedRoute>
            }
          />
          <Route
            path="/createSubject"
            element={
              <ProtectedRoute>
                <RoleBasedRoute element={CreateSubject} allowedRoles={["2"]} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classEdit"
            element={
              <ProtectedRoute>
                <RoleBasedRoute element={ClassEdit} allowedRoles={["2"]} />
              </ProtectedRoute>
            }
          />

          {/* Routes for Employee (Role 3) */}
          <Route
            path="/tuitionMain"
            element={
              <ProtectedRoute>
                <RoleBasedRoute element={TuitionMain} allowedRoles={["3"]} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tuitionMajor"
            element={
              <ProtectedRoute>
                <RoleBasedRoute element={TuitionMajor} allowedRoles={["3"]} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tuitionEdit"
            element={
              <ProtectedRoute>
                <RoleBasedRoute element={TuitionEdit} allowedRoles={["3"]} />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={
              <ProtectedRoute>
                <NoPage role={role} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
