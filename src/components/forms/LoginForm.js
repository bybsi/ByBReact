import { useState, useRef, useContext, useEffect } from 'react';


export function LoginForm( {unRef, pwRef, clName, onClick = null}) {

	return (
	<form className={`byb-form ${clName}`}>
		<div className="field-holder">
			<label htmlFor="login_username" className="absolute-label"> Username</label>
			<input name="login_username" type="text" ref={unRef}/>
		</div>
		<div className="field-holder">
			<label htmlFor="login_password" className="absolute-label"> Password</label>
			<input name="login_password" type="password" ref={pwRef}/>
		</div>
		{onClick && <button id="login_button" className="byb-button" onClick={onClick}>Login</button>}
	</form>
	);
}

