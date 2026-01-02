import { useState, useEffect } from 'react';

export function Help({ section }) {
	const activeIndex = section ? section : 0;
/*
	const [content, setContent] = useState(null);
	useEffect(() => {
		fetch('http://192.168.11.103:3000/documentation_react.php')
		.then(response => {
			if (!response.ok)
				throw new Error('Server Error.');
			return response.text();
		}).then(data => {
			if (section)
				
			setContent(data);
		}).catch(error => {
			setContent(error.toString);
		});
	}, []);
*/
	return (
		<iframe src={`/documentation_react.php?ai=${activeIndex}`}></iframe>
	);
/*
	return (
		<div className="help"
			dangerouslySetInnerHTML={{__html: content}}>
		</div>
	);
*/
};

