import { useState } from 'react';
import Icons from './Icons';
import './Card.scss';

export function Card({ status, children }) {
	const [isBookmarked, setIsBookmarked] = useState(false);

	const toggleBookmark = () => {
		setIsBookmarked(!isBookmarked);
	};

	return (
		<div className={`card ${status}`}>
			<div
				className={`bookmarkIcon ${isBookmarked ? 'bookmarked' : ''}`}
				onClick={toggleBookmark}
			>
				{isBookmarked ? (
					<Icons.Bookmark size={20}/>
				) : (
					<Icons.RegBookmark size={20} />
				)}
			</div>
			{status && <div className={`statusIndicator ${status}`}>{status}</div>}

			<div className="cardContent">{children}</div>
		</div>
	);
}
export function CardContainer({ children }) {
	return <div className="cardContainer">{children}</div>;
}