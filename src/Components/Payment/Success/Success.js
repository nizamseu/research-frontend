import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";

const Success = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [paymentDetails, setpaymentDetails] = useState({});
  const navigate = useNavigate();

  const userData = {
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
  };

  const courseInfo = {
    courseId: paymentDetails.product_id,
    courseName: paymentDetails.product_name,
    courseImage: paymentDetails.product_image,
  };

  const validatePayment = async () => {
    await axios
      .put(
        `https://research-backend-production.up.railway.app/addMyCourses/${user?.email}`,
        {
          courseInfo,
          userData,
        }
      )
      .then((res) => {
        if (res) {
          navigate("/studentdashboard/myCourse");
        }
      });
    console.log({
      courseInfo,
      userData,
    });
  };

  useEffect(() => {
    fetch(`https://research-backend-production.up.railway.app/orders/${id}`)
      .then((res) => res.json())
      .then((data) => setpaymentDetails(data));
  }, [id]);

  return (
    <div className=" min-h-[50vh] mb-10">
      <div className="mt-4 mb-8">
        <h1 className="text-3xl mt-2 text-red-500 font-bold">
          Payment Succesfull
        </h1>
        <h2 className="text-xl">
          You have Pay{" "}
          <span className="text-red-500 font-bold">
            {paymentDetails?.total_amount}$
          </span>{" "}
          For
        </h2>
      </div>
      <div className="lg:w-1/2 w-full mx-auto px-2 lg:px-1">
        <img
          className="my-4 rounded-lg w-full mx-auto"
          src={paymentDetails?.product_image}
          alt="CourseImage"
        />
        <div className="flex justify-between border rounded-md border-gray-300 cursor-pointer">
          <h1 className=" text-xl border-r-2 w-1/2 p-3 bg-gray-100">
            {paymentDetails?.product_name}
          </h1>
          <h2 className=" text-xl w-1/2 p-3 bg-gray-100">
            Instructor: {paymentDetails?.instructor}
          </h2>
        </div>
        <p className="text-base text-justify mt-4 text-gray-500 tracking-wide">
          {paymentDetails?.productDetails}
        </p>
      </div>

      <button
        className="bg-red-500 hover:bg-transparent border border-red-500 px-4 py-3 font-bold text-white hover:text-red-500 rounded-lg duration-300 mt-4 tracking-widest"
        onClick={validatePayment}
      >
        Confirm Paymet
      </button>
    </div>
  );
};

export default Success;
