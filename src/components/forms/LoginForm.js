import { useState, useRef, useContext, useEffect } from 'react';
import { useAuth } from '../../hooks/AuthContext';
import { Modal } from '../Modal';
import { Help } from '../Help';
import { StatusContext } from '../../hooks/StatusContext';
import { RegisterForm } from './RegisterForm';

const ACTION_ID = 0;
const ACTION_LABEL = 1;
const ACTION_TITLE = 2;
const ACTION_COMPONENT = 3;
const actions = [
	['register', 'Register', null, true],
	['help', '?', 'Documentation', true]
];

export function LoginForm() {
	const { user, isAuthenticated, authError, login, logout } = useAuth();

	/*useEffect(() => {
		// Login if the user already has an active session.
		login('','',true);
	}, []);*/

	const { updateStatus } = useContext(StatusContext);
	
	const [ modalComponent, setModalComponent ] = useState(null);
	const [ isModalOpen, setIsModalOpen]  = useState(false);
	const [ modalTitle, setModalTitle ] = useState("");
	const [ statusMessage, setStatusMessage ] = useState("");	
	const [ formDataState, setFormDataState ] = useState(null);
	const [ showModalButtons, setShowModalButtons] = useState(true);

	const usernameRef = useRef(null);
	const passwordRef = useRef(null);
	
	const modalClose = () => {
		setIsModalOpen(false);
		setModalTitle("");
		setStatusMessage("");
		setModalComponent(null);
	};
	
	const modalOpen = (action) => {
	
		if (!action[ACTION_COMPONENT])
			return;
		setIsModalOpen(true);
		setModalTitle(action[ACTION_TITLE] ?? action[ACTION_LABEL]);
		switch (action[ACTION_ID]) {
			case 'register':
				setShowModalButtons(true);
				setModalComponent(
				<RegisterForm 
					updateParentState={setFormDataState} 
					initialState={formDataState ? {...formDataState} : {
						username:'',
						password:'',
						password_verify:'',
						captcha:''
					}}/>);
				break;
			case 'help':
				setShowModalButtons(false);
				setModalComponent(<Help section={0}/>);
				break;
			default:
				break;
		}
	};

	const handleRegisterButton = async (e) => {
		setStatusMessage('Registering...');
		try {
			if (!formDataState.username ||
				!formDataState.password ||
				!formDataState.password_verify ||
				!formDataState.captcha)
				throw new Error("Fill in all fields.");

			if (formDataState.password != formDataState.password_verify)
				throw new Error("The passwords do not match.");

			const response = await fetch('/actions/register_react.php', {
				method: 'POST',
				credentials: 'include',
				headers: {},
				body: new URLSearchParams(formDataState)
			});

			if (!response.status == 500)
				throw new Error("Server error");

			const data = await response.json();
			if (data.error)
				throw new Error(data.error);

			if (data.registered) {
				usernameRef.current.value = formDataState.username;
				passwordRef.current.value = formDataState.password;
				modalClose();
				submitLoginForm();
			}

		} catch(error) {
			updateStatus('error', error.toString(), 1500);
			setStatusMessage(error.toString());
		} finally {
		}
	};

	const submitLoginForm = (event) => {
		if (event)
			event.preventDefault();

		let username = usernameRef.current.value;
		let password = passwordRef.current.value;

		if (!!username && !!password) {
			updateStatus('alert', "Logging in", 500);
			login(username, password);
		} else {
			updateStatus('error', "Missing username or password", 1500);
		}
	};
	
	return (
<>
	<form className="byb-form byb-login-form">
		<div className="field-holder">
			<label htmlFor="login_username" className="absolute-label"> Username</label>
			<input id="login_username" name="login_username" type="text" ref={usernameRef}/>
		</div>
		<div className="field-holder">
			<label htmlFor="login_password" className="absolute-label"> Password</label>
			<input id="login_password" name="login_password" type="password" ref={passwordRef}/>
		</div>
		<button id="login_button" className="byb-button" onClick={submitLoginForm}>Login</button>
	</form>
	{ actions.map((action) => (
		<button key={action[ACTION_ID]} 
			className="byb-button" 
			onClick={() => modalOpen(action)}>
			{action[ACTION_LABEL]}
		</button>
	))}
	<Modal isOpen={isModalOpen} 
		title={modalTitle} 
		onClose={modalClose}
		onRegister={handleRegisterButton}
		statusMessage={statusMessage}
		showButtons={showModalButtons}>
		{modalComponent}
	</Modal>
</>
	);
}
// If action/event handler requires args then
// use {()=>handler('args...')}
