import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import UserRoutes from "./clientRoutes/UserRoutes";
const AppRoutes = () => {
  const location = useLocation();

  return (
    <div>
      <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/*" element={<UserRoutes />} />
     </Routes>
      </AnimatePresence>
    </div>
  );
};

export default AppRoutes;