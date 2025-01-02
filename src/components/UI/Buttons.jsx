import './Buttons.scss';

const Button = ({ children, onClick, className = ''}) => {
	return (
		<button
			className={!className && 'defaultStyle'}
			onClick={onClick}
		>
			{children}
		</button>
	);
};

export default Button;