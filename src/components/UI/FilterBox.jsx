import './FilterBox.scss';
import CollapsiblePanel from './CollapsiblePanel';
const FilterBox = ({ title, options, selectedValues, onChange }) => {
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return (
		<div className="filterBox">
			<CollapsiblePanel title={title} titleSize='small'>
				<div className="filterOptions">
					{options.map((option) => (
						<label key={option.CoursecategoryID}>
							<input
								type="checkbox"
								value={option.CoursecategoryName}
								checked={selectedValues.includes(option.CoursecategoryName)}
								onChange={() => onChange(option.CoursecategoryName)}
							/>
							{option.CoursecategoryName}
						</label>
					))}
				</div>
			</CollapsiblePanel>

		</div>
	);
};

export default FilterBox;