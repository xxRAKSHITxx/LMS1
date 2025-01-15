import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireAuth({ allowedRoles }) {
  const { role, isLoggedIn } = useSelector((state) => state.auth);
  const location = useLocation();

  console.log("RequireAuth - Current Role:", role);
  console.log("RequireAuth - Is Logged In:", isLoggedIn);
  console.log("RequireAuth - Allowed Roles:", allowedRoles);

  return isLoggedIn && allowedRoles.find((myRole) => myRole === role) ? (
    <Outlet />
  ) : isLoggedIn ? (
    <Navigate to="/denied" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}