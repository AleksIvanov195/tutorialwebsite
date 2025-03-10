import './FilterBox.scss';
import CollapsiblePanel from './CollapsiblePanel';
import useLoad from '../../api/useLoad';
const FilterBox = ({ title, endpoint, idfield, textfield, selectedValues, onChange }) => {
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	const [options, , , isOptionsLoading] = useLoad(endpoint);
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	if(isOptionsLoading) {
		return <p> Loading options ...</p>;
	}
	return (
		<div className="filterBox">
			<CollapsiblePanel title={title} titleSize='small'>
				<div className="filterOptions">
					{options.map((option) => (
						<label key={option[idfield]}>
							<input
								type="checkbox"
								value={option[textfield]}
								checked={selectedValues.includes(option[textfield])}
								onChange={() => onChange(option[textfield])}
							/>
							{option[textfield]}
						</label>
					))}
				</div>
			</CollapsiblePanel>

		</div>
	);
};

export default FilterBox;