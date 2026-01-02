import { createPortal } from 'react-dom';

export const Modal = ({
		title, isOpen, showButtons,
		onClose, onSave, onRegister, 
		statusMessage, children}) => {

	let saveButton = null, registerButton = null;

	if (!isOpen)
		return null;

//	const saveButton = children.props.onSave ?
//		<button className="modal-button" onClick={children.props.onSave}>Save</button> :
//		null;

	if (showButtons) {
		if (onSave)
			saveButton = 
				<button className="modal-button" onClick={onSave}>Save</button>;
		if (onRegister)
			registerButton = 
				<button className="modal-button" onClick={onRegister}>Register</button>;
	}

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
			{saveButton}
			{registerButton}
		</div>
	</div>
</div>, document.body);
};

