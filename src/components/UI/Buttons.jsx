import './Buttons.scss';

export const Button = ({ type = 'button', children, onClick, className, icon }) => {
	const buttonClass = className ? className : 'defaultStyle';
	return (
		<button
			type={type}
			className={buttonClass}
			onClick={onClick}
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

