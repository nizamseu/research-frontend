import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import Loading from "../../Loading/Loading";

const PrivateRoute = ({ children, ...rest }) => {
	const { user, isLoading } = useAuth();
	let location = useLocation();
	if (isLoading) {
		return (
			<div className='flex h-screen'>
				<div className='m-auto'>
					<Loading />
				</div>
			</div>
		);
	}
	if (user.email) {
		return children;
	}
	return <Navigate to='/login' state={{ from: location }} />;
};

export default PrivateRoute;
