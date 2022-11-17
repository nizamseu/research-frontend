import React from "react";
import { useNavigate } from "react-router-dom";
import { reactLocalStorage } from "reactjs-localstorage";

const Test = () => {
	const moveTo = useNavigate();
	const start = () => {
		reactLocalStorage.setObject("datas", null);
		moveTo("/test2");
	};

	return (
		<div>
			<button
				className='bg-red-500 text-white font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none m-5 ease-linear transition-all duration-150 border border-red-500 hover:text-red-500 hover:bg-transparent'
				onClick={start}>
				Start
			</button>
		</div>
	);
};

export default Test;
