import { useState, useEffect, useContext } from 'react';
import { StatusContext } from '../../hooks/StatusContext';

export function RegisterForm({updateParentState, initialState}) {
	const { updateStatus } = useContext(StatusContext);

	const [ localState, setLocalState ] = useState(initialState);
	const [ captchaSrc, setCaptchaSrc ] = useState(null);

	const updateLocalState = (e) => {
		// Computed property name [e.target.name]
		setLocalState(prev => ({...prev, [e.target.name]:e.target.value}));
	};

	useEffect(() => {
		updateParentState((prev) => ({...localState}));

		if (!captchaSrc) {
			fetch('/api/index.php?r=get_captcha', {
				method:'GET',
				credentials:'include',
				headers:{},
			}).then(response => {
				if (!response.ok) 
					throw new Error('Could not get captcha.');
				return response.json();
			}).then(data => {
				if (!data.captchaSrc)
					throw new Error('Captcha returned invalid data.');
				setCaptchaSrc(data.captchaSrc);
			}).catch(error => {
				console.log(error);
				updateStatus('error', error.toString());
			});
		}
	}, [localState]);

	// TODO switch to using a formData approach
	// to avoid onChange=
	return (
<div className="register-form">
        <form action="javascript:void(0);">
                <div className="dialog-form-cell">
                        <label htmlFor="username">Username</label><br />
                        <input type="text" id="username" name="username" maxLength="32" value={localState.username} onChange={updateLocalState}/>
                </div>
                <div className="dialog-form-cell">
                        <label htmlFor="password">Password</label><br />
                        <input type="password" id="password" name="password" value={localState.password} onChange={updateLocalState}/>
                </div>
                <div className="dialog-form-cell">
                        <label htmlFor="passwordVerify">Verify Password</label><br />
                        <input type="password" id="password_verify" name="password_verify" value={localState.password_verify} onChange={updateLocalState}/>
                </div>
                <div className="dialog-form-cell">
                        <label htmlFor="captcha">Enter the <i>letters</i> in numeric order.</label><br />
                        <img src={captchaSrc} className="captcha" />
                        <input type="text" id="captcha" name="captcha" onChange={updateLocalState}/>
                </div>
        </form>
</div>
	);
};

