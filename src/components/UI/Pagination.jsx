import { Button } from './Buttons';
import Icons from './Icons';
import './Pagination.scss';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
	// If no pages do not display the pagination
	if (totalPages <= 1) return null;

	return (
		<div className={'pagination'}>

			<Button
				onClick={() => onPageChange(currentPage - 1)}
				disabled={currentPage === 1}
				title="Previous">
				<Icons.Previous/>
			</Button>

			<div className="paginationInfo">
					Page <span className="paginationCurrent">{currentPage}</span> of{' '}
				<span className="paginationTotal">{totalPages}</span>
			</div>

			<Button
				onClick={() => onPageChange(currentPage + 1)}
				disabled={currentPage >= totalPages}
				title="Next">
				<Icons.Next/>
			</Button>

		</div>
	);
};

export default Pagination;