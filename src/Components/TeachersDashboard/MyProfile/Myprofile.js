import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import useAuth from "../../../hooks/useAuth";
import Modal from "./Modal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebook,
  faLinkedin,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import LoadingOverlay from "../../Loading/LoadingOverlay";

const MyProfile = () => {
  const [showModal, setShowModal] = React.useState(false);
  const { savedUser } = useAuth();
  const [singleTeacher, setSingleTeacher] = useState({});
  useEffect(() => {
    fetch(
      `https://research-backend-production.up.railway.app/singleTeacher?email=${savedUser.email}`
    )
      .then((res) => res.json())
      .then((data) => setSingleTeacher(data));
  }, [savedUser.email, showModal]);
  console.log("singleTeacher", singleTeacher);

  return (
    <div className=" container mt-4 mx-auto">
      <div className="xl:flex lg:flex: md:flex sm:block flex-row w-full">
        <div className="w-2/6 text-left border rounded-md mb-4 mx-4 shadow-md">
          <img
            style={{ width: "100%" }}
            className="rounded-t-md"
            src={singleTeacher?.photoURL || savedUser.photoURL}
            alt="Teachers"
          />
          <div className="border-b-2 border-red-500 px-5 py-2 bg-gray-800 font-bold tracking-widest">
            <h4 className="text-xl text-red-500">
              {singleTeacher?.displayName}
            </h4>
            <h4 className="text-white">{singleTeacher?.designation}</h4>
          </div>
          <div className="pl-5 pr-3 text-lg pt-2 pb-7">
            <h4>
              <span className="font-bold">Email:</span> {singleTeacher?.email}
            </h4>
            <h4>
              <span className="font-bold">Phone:</span> {singleTeacher?.phone}
            </h4>
            <h4>
              <span className="font-bold">Age:</span> {singleTeacher?.age}
            </h4>
            <h4>
              <span className="font-bold">Gender:</span> {singleTeacher?.gender}
            </h4>
            <h4>
              <span className="font-bold">Address:</span>{" "}
              {singleTeacher?.address}
            </h4>
            <ul className="flex mt-2">
              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={singleTeacher?.facebook}
                >
                  <FontAwesomeIcon
                    className="text-gray-700 text-3xl mx-2"
                    icon={faFacebook}
                  />
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={singleTeacher?.twitter}
                >
                  <FontAwesomeIcon
                    className="text-gray-700 text-3xl mx-2"
                    icon={faTwitter}
                  />
                </a>
              </li>
              <li>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  href={singleTeacher?.linkedin}
                >
                  <FontAwesomeIcon
                    className="text-gray-700 text-3xl mx-2"
                    icon={faLinkedin}
                  />
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="w-4/6 mx-4 border rounded-md shadow-md pb-5 mb-8">
          <h4 className="text-left text-2xl p-5 font-semibold flex justify-between">
            <span>
              <span>About Of</span>
              {"  "}
              <span className="text-red-500 text-3xl">
                {singleTeacher?.displayName || savedUser.displayName}
              </span>
            </span>
            <FontAwesomeIcon
              onClick={() => setShowModal(true)}
              icon={faPenToSquare}
              className="text-2xl sm:mr-9 mr-0 cursor-pointer text-red-500"
            />
          </h4>
          <hr />
          <div className="pl-5 text-left">
            <p className="text-gray-500 my-4 tracking-wider">
              {singleTeacher?.about}
            </p>
            <h2 className="text-2xl font-bold">Skills</h2>
            {singleTeacher?.skills === undefined ? (
              <h4 className="my-6">N/A</h4>
            ) : (
              <h4 className="my-6">
                {singleTeacher?.skills?.split(",")?.map((expert, key) => (
                  <p
                    className="mr-4 bg-gray-800 text-white py-2 px-4 rounded-md inline-block mb-2"
                    key={key}
                  >
                    {expert}
                  </p>
                ))}
              </h4>
            )}
            <h2 className="text-2xl font-bold">Language</h2>
            {singleTeacher?.language?.length === 0 ? (
              <h4 className="my-6">N/A</h4>
            ) : (
              <h4 className="my-6">
                {singleTeacher?.language?.split(",")?.map((lang, key) => (
                  <p
                    className="mr-4 bg-gray-800 py-2 px-4 text-white rounded-md inline-block mb-2"
                    key={key}
                  >
                    {lang}
                  </p>
                ))}
              </h4>
            )}
            <h2 className="text-lg mb-2">
              <span className="font-bold">Experience: </span>
              {singleTeacher?.experinece} Years
            </h2>
            <h2 className="text-lg mb-2">
              <span className="font-bold">Operation Done: </span>
              <CountUp
                start={0}
                end={singleTeacher?.operationDone}
                duration={4.25}
              />
            </h2>
            <h2 className="text-lg mb-2">
              <span className="font-bold">Join Date: </span> 10-February-2020
            </h2>
            <h2 className="text-lg mb-4">
              <span className="font-bold">Job Type: </span>
              {singleTeacher?.type}
            </h2>
          </div>
        </div>
      </div>
      {showModal ? (
        <>
          <Modal setShowModal={setShowModal} />
        </>
      ) : null}
      {(!savedUser || !singleTeacher) && <LoadingOverlay />}
    </div>
  );
};

export default MyProfile;
