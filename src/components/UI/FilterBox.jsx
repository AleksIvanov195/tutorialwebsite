import './FilterBox.scss';

const FilterBox = ({ title, options, selectedValues, onChange }) => {
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return (
		<div className="filterBox">
			<h4>{title}</h4>
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
		</div>
	);
};

export default FilterBox;