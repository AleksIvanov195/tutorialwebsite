import './Buttons.scss';

export const Button = ({ type = 'button', children, onClick, className }) => {
	const buttonClass = className ? className : 'defaultStyle';
	return (
		<button
			type={type}
			className={buttonClass}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export const ButtonTray = ({ children }) => {
	return(
		<div className='buttonTray'>
			{children}
		</div>
	);
};

