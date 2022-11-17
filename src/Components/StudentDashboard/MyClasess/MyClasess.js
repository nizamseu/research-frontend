import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import LoadingOverlay from "../../Loading/LoadingOverlay";
import { faFaceFrown } from "@fortawesome/free-solid-svg-icons";
const MyClasess = () => {
	const { savedUser } = useAuth();
	const [courses, setCourses] = React.useState();
	React.useEffect(() => {
		axios
			.get(
				`https://fierce-caverns-90976.herokuapp.com/allusers?email=${savedUser.email}`,
			)
			.then((res) => {
				setCourses(res.data?.myCourse);
			});
	}, [savedUser]);

	return (
		<div className='container mx-auto my-9  px-4 md:px-9 '>
			<h1 className='text-center text-3xl uppercase font-semibold mt-14 md:mb-9 mb-5 text-red-500'>
				My Courses
			</h1>

			{courses ? (
				<div className='mx-auto grid grid-cols-12 gap-9'>
					{courses?.map((item) => (
						<div className='md:col-span-4 col-span-12'>
							<Link to={`/studentdashboard/milestone/${item?.courseId}`}>
								<div
									className='border  rounded-lg card mx-auto duration-300  bg-white'
									style={{ maxWidth: "400px" }}>
									<div className='overflow-hidden'>
										<img
											className='object-fill h-36 w-96 card-image rounded-t-lg'
											src={item?.courseImage}
											alt={item?.courseName}
										/>
									</div>
									<div className='px-4 card-content'>
										<h1 className='text-lg font-bold my-4 text-stone-700 hover:text-red-500 duration-300 cursor-pointer text-center'>
											{item?.courseName}
										</h1>
									</div>
								</div>
							</Link>
						</div>
					))}
				</div>
			) : (
				<div>
					<FontAwesomeIcon
						className='mx-auto text-red-500 icon text-4xl my-4'
						icon={faFaceFrown}
					/>
					<h2 className=' text-xl font-bold  text-red-500'>
						You should buy some courses
					</h2>
				</div>
			)}

			{(!savedUser || !courses) && <LoadingOverlay />}
		</div>
	);
};

export default MyClasess;
