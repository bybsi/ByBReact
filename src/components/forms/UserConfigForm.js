import { useState, useEffect } from 'react';

export function UserConfigForm({updateParentState, initialState}) {

	const [ localState, setLocalState ] = useState(initialState);
	
	const updateLocalState = (e) => {
		// Computed property name [e.target.name]
		setLocalState(prev => ({...prev, [e.target.name]:e.target.value}));
	};

	useEffect(() => {
		updateParentState(localState);
	}, [localState]);

	return (
<div className="user-config-form">
	<form action="javascript:void(0);">
		<div className="dialog-form-cell">
			<b>Username: </b>{localState.username}
		</div>
		<div className="dialog-form-cell">
			<label htmlFor="display_name">Display Name</label><br />
			<input type="text" id="display_name" name="display_name" maxLength="32" value={localState.display_name ?? ''} onChange={updateLocalState}/>
		</div>
		<div className="dialog-form-cell">
			<label htmlFor="contact_data">Contact Info</label><br />
			<input type="text" id="contact_data" name="contact_data" maxLength="32" value={localState.contact_data ?? ''} onChange={updateLocalState}/>
		</div>
	</form>
</div>
	);
};

