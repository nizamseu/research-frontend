import axios from "axios";
import React, { useEffect, useState } from "react";
import { reactLocalStorage } from "reactjs-localstorage";

const Test2 = () => {
	const [data, setData] = useState();
	let i = 1;
	const get = reactLocalStorage.getObject("datas");
	useEffect(() => {
		setInterval(() => {
			axios
				.get(
					`https://hn.algolia.com/api/v1/search_by_date?tags=story&page=${i++}`,
				)
				.then((res) => setData(res.data));
		}, 5000);
	}, [i]);

	useEffect(() => {
		if (get === null) {
			reactLocalStorage.setObject("datas", [data?.hits]);
		} else {
			reactLocalStorage.setObject("datas", [...data?.hits, ...get]);
		}
	}, [data?.hits, get]);

	return (
		<div className='mt-5'>
			<h1>Total : {get?.slice(0, -1).length}</h1>
			<div className='grid gap-2 grid-cols-4 mx-auto'>
				{get?.slice(0, -1)?.map((book) => (
					<>
						<p className='bg-gray-500 p-2 text-white'>Title:{book?.title}</p>
					</>
				))}
			</div>
		</div>
	);
};

export default Test2;
