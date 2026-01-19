import { useState, useRef, useContext, useEffect } from 'react';
import { useAuth } from '../../hooks/AuthContext';
import { Modal } from '../Modal';
import { Help } from '../Help';
import { StatusContext } from '../../hooks/StatusContext';
import { RegisterForm } from './RegisterForm';
import { LoginForm } from './LoginForm';
import { modalVars } from '../ModalVars';

const ACTION_ID = 0;
const ACTION_LABEL = 1;
const ACTION_TITLE = 2;
const ACTION_COMPONENT = 3;
const signin_action = ['signin', 'Sign  In', 'Sign In', true];
const actions = [
	['register', 'Register', null, true],
	['help', '?', 'Documentation', true]
];

export function BaseLoginForm() {
	const { user, isAuthenticated, authError, login, logout } = useAuth();

	const { updateStatus } = useContext(StatusContext);
	
	const [ modalComponent, setModalComponent ] = useState(null);
	const [ isModalOpen, setIsModalOpen]  = useState(false);
	const [ modalTitle, setModalTitle ] = useState("");
	const [ statusMessage, setStatusMessage ] = useState("");	
	const [ registerData, setRegisterData ] = useState(null);
	const [ signinData, setSigninData ] = useState(null);
	const [ modalButtonsFlag, setModalButtonsFlag] = useState(0);

	const usernameRef = useRef(null);
	const passwordRef = useRef(null);
	const usernameRefModal = useRef(null);
	const passwordRefModal = useRef(null);
	
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
				setModalButtonsFlag(modalVars.BUTTON_SAVE & modalVars.BUTTON_REGISTER);
				setModalComponent(<RegisterForm 
					updateParentState={setRegisterData} 
					initialState={registerData ? {...registerData} : {
						username:'',
						password:'',
						password_verify:'',
						captcha:''
					}}/>);
				break;
			case 'help':
				setModalButtonsFlag(0);
				setModalComponent(<Help section={0}/>);
				break;
			case 'signin':
				setModalButtonsFlag(modalVars.BUTTON_SIGNON);
				setModalComponent(<LoginForm 
					unRef={usernameRefModal} 
					pwRef={passwordRefModal} />);
				break;
			default:
				break;
		}
	};

	/* This is for the @media screen <= 740px button */
	const handleSigninButton = async (e) => {
		submitLoginForm(e, true);
	};

	const handleRegisterButton = async (e) => {
		setStatusMessage('Registering...');
		try {
			if (!registerData.username ||
				!registerData.password ||
				!registerData.password_verify ||
				!registerData.captcha)
				throw new Error("Fill in all fields.");

			if (registerData.password != registerData.password_verify)
				throw new Error("The passwords do not match.");

			const response = await fetch('/actions/register_react.php', {
				method: 'POST',
				credentials: 'include',
				headers: {},
				body: new URLSearchParams(registerData)
			});

			if (!response.status == 500)
				throw new Error("Server error");

			const data = await response.json();
			if (data.error)
				throw new Error(data.error);

			if (data.registered) {
				usernameRef.current.value = registerData.username;
				passwordRef.current.value = registerData.password;
				modalClose();
				submitLoginForm();
			}

		} catch(error) {
			updateStatus('error', error.toString(), 1500);
			setStatusMessage(error.toString());
		} finally {
		}
	};

	const submitLoginForm = (event, fromModalForm=false) => {
		if (event)
			event.preventDefault();

		let username, password;
		if (fromModalForm) {
			username = usernameRefModal.current.value;
			password = passwordRefModal.current.value;
		} else {
			username = usernameRef.current.value;
			password = passwordRef.current.value;
		}

		if (!!username && !!password) {
			updateStatus('alert', "Logging in", 500);
			login(username, password);
		} else {
			updateStatus('error', "Missing username or password", 1500);
		}
	};
	
	return (
<>
	{/* signin-button is for @media screen <= 740px */}
	<button className="byb-button signin-button" onClick={()=>modalOpen(signin_action)}>Sign in</button>
	<LoginForm unRef={usernameRef} pwRef={passwordRef} onClick={submitLoginForm} clName="byb-login-form"/>
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
		onSignin={handleSigninButton}
		statusMessage={statusMessage}
		buttonFlags={modalButtonsFlag}>
		{modalComponent}
	</Modal>
</>
	);
}
// If action/event handler requires args then
// use {()=>handler('args...')}
