import Icons from '../../UI/Icons';
import { Card } from '../../UI/Card';
import './CourseCard.scss';

const CourseCard = ({ status, isCardBookmarked, children, handleBookmark, handleCardClicked }) => {
	const toggleBookmark = (event) => {
		event.stopPropagation();
		handleBookmark();
	};

	return (
		<Card className={`courseCard ${status}`} onClick={handleCardClicked}>
			{
				handleBookmark &&
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
			}

			{status && <div className={`statusIndicator ${status}`}>{status}</div>}
			<div className="cardContent">{children}</div>
		</Card>
	);
};

export default CourseCard;