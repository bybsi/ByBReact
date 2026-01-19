import { createPortal } from 'react-dom';
import { modalVars } from './ModalVars';

export const Modal = ({
		title, isOpen, buttonFlags,
		onClose, onSave, onRegister, onSignin,
		statusMessage, children}) => {

	let saveButton = null, registerButton = null, signinButton = null;

	if (!isOpen)
		return null;

	if (onSave && buttonFlags & modalVars.BUTTON_SAVE)
		saveButton = 
			<button className="modal-button" onClick={onSave}>Save</button>;
	if (onRegister && buttonFlags & modalVars.BUTTON_REGISTER)
		registerButton = 
			<button className="modal-button" onClick={onRegister}>Register</button>;
	if (onSignin && buttonFlags & modalVars.BUTTON_SIGNON)
		signinButton =
			<button className="modal-button" onClick={onSignin}>Sign In</button>;

	return createPortal(
<div className="modal-overlay">
	<div className="modal-content">
		<h2>{title}</h2>
		<div className="modal-content-inner">
			{children}
		</div>
		{statusMessage && <div className="modal-status">{statusMessage}</div>}
		<div className="modal-button-bar">
			<button className="modal-button" onClick={onClose}>Close</button>
			{signinButton}
			{saveButton}
			{registerButton}
		</div>
	</div>
</div>, document.body);
};

