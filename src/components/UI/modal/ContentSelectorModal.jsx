import { useState } from 'react';
import SearchBar from '../SearchBar';
import useLoad from '../../../api/useLoad';
import Modal from './Modal';
import { Button, ButtonTray } from '../Buttons';
import './ContentSelectorModal.scss';
const ContentSelectorModal = ({ endpoint, idField, textField, onClose, onSave }) => {
	// State ------------------------------------------------------
	const [searchString, setSearchString] = useState('');
	const [items] = useLoad(`${endpoint}?search=${searchString}&searchFields=${textField}&orderby=${textField}`);
	const [selectedItems, setSelectedItems] = useState([]);
	// Handlers ---------------------------------------------------
	const addItem = (itemID) => setSelectedItems((prev) => [...prev, itemID]);
	const removeItem = (itemID) => setSelectedItems((prev) => prev.filter((id) => id !== itemID));
	const handleSelect = (itemID) => {
		selectedItems.includes(itemID) ? removeItem(itemID) : addItem(itemID);
	};

	// View -------------------------------------------------------
	return (
		<Modal onClose={onClose}>
			<div className="contentSelectorContainer">
				<SearchBar searchString={searchString} setSearchString={setSearchString} placeholder="Search..." />
				<ul>
					{items.map((item) => (
						<li key={item[idField]} onClick={() => handleSelect(item[idField])}>
							<input
								type="checkbox"
								checked={selectedItems.includes(item[idField])}
								id={`checkbox-${item[idField]}`}
							/>
							<span>{item[textField]}</span>
						</li>
					))}
				</ul>
				<ButtonTray>
					<Button onClick={() => onSave(selectedItems)}>Save</Button>
					<Button onClick={onClose}>Close</Button>
				</ButtonTray>
			</div>
		</Modal>
	);
};

export default ContentSelectorModal;
