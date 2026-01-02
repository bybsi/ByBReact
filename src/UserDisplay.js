import { useState, useContext } from 'react';
import { useAuth } from './hooks/AuthContext';
import { StatusContext } from './hooks/StatusContext';
import { Modal } from './components/Modal';
import { Help } from './components/Help';
import { UserConfigForm } from './components/forms/UserConfigForm';

const iconPath = "/images/icons";

const ACTION_ID = 0;
const ACTION_LABEL = 1;
const ACTION_TITLE = 2;
const ACTION_HAS_COMPONENT = 3;
const actions = [
	['config', 'Settings', null, true],
	['logout',  'Logout', null, null],
	['help', 'Help', 'Documentation', true]
];

export function UserDisplay() {
	const { user, setUser, isAuthenticated, authError, login, logout } = useAuth();
	const { updateStatus } = useContext(StatusContext);

	const [ modalComponent, setModalComponent ] = useState(null);
	const [ showModalButtons, setShowModalButtons] = useState(true);
	const [ isModalOpen, setIsModalOpen]  = useState(false);
	const [ modalTitle, setModalTitle ] = useState("");
	const [ statusMessage, setStatusMessage ] = useState("");
	const [ formDataState, setFormDataState ] = useState({});

	const handleSaveButton = async (e) => {
		try {
			const response = await fetch('/actions/profile.php', {
					method: 'POST',
					credentials: 'include',
					headers: {},
					body: new URLSearchParams(formDataState)
				});

			const data = await response.json();

			if (data.saved) {
				setStatusMessage("Saved");
				if (data.display_name != user.displayName ||
					data.contact_data != user.contactData) {
					setUser((prev) => ({
						...prev, 
						displayName:data.display_name,
						contactData:data.contact_data
					}));
					updateStatus('alert', "Settings saved.", 2000);
				}
			} else if (data.error) {
				setStatusMessage("Could not save profile");
				updateStatus('error', data.error, 2000);
			}
			
		} catch (err) {
			console.log(err.message);
			setStatusMessage("Error");
		} finally {
		}

	};

	const  modalOpen = (action) => {
		if (action[ACTION_ID] == 'logout') {
			logout();
			return;
		}

		if (!action[ACTION_HAS_COMPONENT]) 
			return;

		setIsModalOpen(true);
		setModalTitle(action[ACTION_TITLE] ?? action[ACTION_LABEL]);
		switch (action[ACTION_ID]) {
			case 'config':
				setShowModalButtons(true);
				setModalComponent( 
				<UserConfigForm 
					updateParentState={setFormDataState} 
					initialState={{
						'username':user.userName,
						'display_name':user.displayName,
						'contact_data':user.contactData
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

	const modalClose = () => {
		setIsModalOpen(false);
		setModalTitle("");
		setStatusMessage("");
		setFormDataState({});
		setModalComponent(null);
	};

	return (
<div className="user-panel">
	<div className="user-avatar">Hello <b className="user-display-name">{user.displayName}</b></div>
	{ actions.map((action) => (
		<div key={action[ACTION_ID]} 
			className="user-panel-icon" 
			onClick={() => modalOpen(action)}>
			<img src={`${iconPath}/${action[ACTION_ID]}.png`} alt={action[ACTION_LABEL]}/>
		</div>
	))}

	<Modal isOpen={isModalOpen} 
		title={modalTitle} 
		onClose={modalClose}
		onSave={handleSaveButton}
		statusMessage={statusMessage}
		showButtons={showModalButtons}>
		{modalComponent}
	</Modal>
</div>
);
}

