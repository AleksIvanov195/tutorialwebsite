import Icons from './Icons';
import './Card.scss';

export function Card({ status, isCardBookmarked, children, handleBookmark, handleCardClicked }) {

	const toggleBookmark = () => {
		handleBookmark();
	};

	return (
		<div className={`card ${status}`}>
			<div
				className={`bookmarkIcon ${isCardBookmarked ? 'bookmarked' : ''}`}
				onClick={toggleBookmark}
			>
				{isCardBookmarked ? (
					<Icons.Bookmark size={20} />
				) : (
					<Icons.RegBookmark size={20} />
				)}
			</div>
			{status && <div className={`statusIndicator ${status}`}>{status}</div>}
			<div className = "clickableArea" onClick={handleCardClicked}>
				<div className="cardContent">{children}</div>
			</div>
		</div>

	);
}

export function CardContainer({ children }) {
	return <div className="cardContainer">{children}</div>;
}