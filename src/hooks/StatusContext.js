import { createContext, useState } from 'react';

export const StatusContext = createContext();

export const StatusProvider = ({children}) => {
	const [statusObj, setStatus] = useState({
		'message':'',
		// .byb-header-${class}
		'_class':'hidden'
	});

	const updateStatus = (_class, message, wait = 0) => {
		setStatus((prev) => ({_class:_class, message:message}));
		if (wait)
			setTimeout(() => {updateStatus('hidden','',0);}, wait);
	};

	return (
		<StatusContext.Provider value={{statusObj, updateStatus}}>
			{children}
		</StatusContext.Provider>
	);
}

