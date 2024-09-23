import React from "react";
import { useSelector } from "react-redux";
import {Outlet, Navigate} from "react-router-dom"

const PrivateRoute = () =>
{
    const {currentUser} = useSelector((state)=>state.user)

    return currentUser ? <Outlet /> : <Navigate to={"/signin"} />
}
// The <Outlet /> component is a placeholder that renders the child routes of the PrivateRoute.
// In this case, if the user is authenticated, Outlet will render the Profile component as specified in your route configuration.
export default PrivateRoute;