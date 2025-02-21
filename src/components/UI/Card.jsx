import React from 'react';
import './Card.scss';

export function Card({ status, children }) {
	return (
		<div className={`card ${status}`}>
			{status && <div className={`statusIndicator ${status}`}>{status}</div>}
			<div className="cardContent">{children}</div>
		</div>
	);
}

export function CardContainer({ children }) {
	return <div className="cardContainer">{children}</div>;
}