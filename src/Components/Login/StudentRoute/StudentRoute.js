import useAuth from "../../../hooks/useAuth";

import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router";
import Loading from "../../Loading/Loading";

const StudentRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const [student, setStudent] = useState(false);

  useEffect(() => {
    const loadFUncion = async () => {
      setIsLoading(true);
      await fetch(
        `https://research-backend-production.up.railway.app/getUserRole/${user.email}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data[0].role === "Student") {
            setStudent(true);
            setIsLoading(false);
          } else if (data[0].role !== "Student") {
            setStudent(false);
            setIsLoading(false);
          }
        });
    };
    loadFUncion();
  }, [user.email]);

  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <div className="m-auto">
          <Loading />
        </div>
      </div>
    );
  }
  if (user.email && student) {
    return children;
  } else return <Navigate to="/wrongAdminRoute" state={{ from: location }} />;
};

export default StudentRoute;
