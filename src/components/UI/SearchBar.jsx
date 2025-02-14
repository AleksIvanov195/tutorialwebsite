import { useState } from 'react';
import './SearchBar.scss';

const SearchBar = ({ searchString, setSearchString, placeholder = 'Search...' }) => {
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	const [inputValue, setInputValue] = useState(searchString);
	// Handlers ---------------------------------------------------
	const handleKeyDown = (e) => {
		setInputValue(e.target.value);
		setSearchString(e.target.value);
	};
	// View -------------------------------------------------------
	return (
		<div className = "searchBar">
			<input
				type="text"
				value={inputValue}
				onChange={handleKeyDown}
				placeholder={placeholder}
			/>
		</div>
	);
};

export default SearchBar;
