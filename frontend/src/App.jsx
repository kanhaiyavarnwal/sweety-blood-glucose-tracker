// import { Routes,Route ,Navigate} from "react-router-dom";
// import Signup from "./pages/Signup";
// import Login from "./pages/Login"
// import ProtectedRoute from "./components/ProtectedRoute";
// import Dashboard from "./pages/Dashboard";
// import DashboardLayout from "./layout/DashboardLayout";
// import Readings from "./pages/Reading";
// import AddReading from "./pages/Addreading";
// import Reports from "./pages/Report";
// import Profile from "./pages/Profile";
// function App() {


//   return (
//     <>
//     <Routes>
//       <Route path="/register" element={<Signup />} />
//       <Route path="/login" element={<Login />} />
//   <Route  element={<ProtectedRoute/>}>
//       <Route element={<DashboardLayout />}/>
//     <Route path="/dashboard" element={<Dashboard />} />
//       <Route
//                 path="/readings"
//                 element={<Readings />}
//               />
//       <Route
//                 path="/add-reading"
//                 element={<AddReading />}
//               />
//       <Route
//                 path="/reports"
//                 element={<Reports />}
//               />
//        <Route
//                 path="/profile"
//                 element={<Profile />}
//               />
//   </Route>
//      <Route path="/" element={<Navigate to="/dashboard" replace />} />
 

//     </Routes>
    
//     </>
//   );
// }

// export default App


import { Routes, Route, Navigate } from "react-router-dom";

import Signup from "./pages/Signup";
import Login from "./pages/Login";

import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./layout/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Readings from "./pages/Reading";
// import AddReading from "./pages/AddReading";
import Reports from "./pages/Report";
import Profile from "./pages/Profile";
import AddReading from "./pages/AddReading"

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/register" element={<Signup />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>

        {/* Common Layout */}
        <Route element={<DashboardLayout />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/readings"
            element={<Readings />}
          />

          <Route
            path="/add-reading"
            element={<AddReading/>}
          />

          <Route
            path="/reports"
            element={<Reports />}
          />

          <Route
            path="/profile"
            element={<Profile />}
          />

        </Route>
      </Route>

      {/* Default Route */}
      <Route
        path="/"
        element={<Navigate to="/dashboard" replace />}
      />

      {/* Unknown Routes */}
      <Route
        path="*"
        element={<Navigate to="/dashboard" replace />}
      />
    </Routes>
  );
}

export default App;

