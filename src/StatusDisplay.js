import { useContext } from 'react';
import { StatusContext } from './hooks/StatusContext';

export function StatusDisplay() {
	const { statusObj } = useContext(StatusContext);
	const className = 'byb-' + statusObj._class;
	return (
		<div className={`byb-header-status ${className}`}>
			{statusObj.message}
		</div>
	);
}

