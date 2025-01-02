import './Buttons.scss';

const Button = ({ children, onClick, className }) => {
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

export default Button;