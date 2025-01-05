import './Modal.scss';
const Modal = ({ open, children, onClose }) =>{
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return(
		<div className = "overlay">
			<div className = "modal">
				{children}
			</div>
		</div>
	);
};
export default Modal;