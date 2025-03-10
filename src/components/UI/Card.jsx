import './Card.scss';

export function Card({ className, children, onClick }) {
	return (
		<div className={`card ${className}`} onClick={onClick}>
			{children}
		</div>
	);
}

export function CardContainer({ children }) {
	return <div className="cardContainer">{children}</div>;
}