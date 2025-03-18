import './Buttons.scss';

export const Button = ({ type = 'button', children, onClick, className, icon, title, disabled = false }) => {
	const buttonClass = className ? className : 'defaultStyle';
	return (
		<button
			type={type}
			className={buttonClass}
			onClick={onClick}
			title={title}
			disabled = {disabled}
		>
			{icon && <span className='icon'>{icon}</span>}
			{children}
		</button>
	);
};

export const ButtonTray = ({ children, className }) => {
	const buttonTrayClass = className ? className : 'defaultButtonTray';
	return(
		<div className={buttonTrayClass}>
			{children}
		</div>
	);
};

