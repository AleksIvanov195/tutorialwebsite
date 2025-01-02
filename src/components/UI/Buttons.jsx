import './Buttons.scss';

export const Button = ({ children, onClick, className }) => {
	const buttonClass = className ? className : 'defaultStyle';
	return (
		<button
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

