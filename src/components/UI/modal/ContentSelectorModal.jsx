import { useState } from 'react';
import SearchBar from '../SearchBar';
import useLoad from '../../../api/useLoad';
import Modal from './Modal';
import { Button, ButtonTray } from '../Buttons';
import './ContentSelectorModal.scss';
const ContentSelectorModal = ({ endpoint, idField, textField, onClose, onSave, title }) => {
	// State ------------------------------------------------------
	const [searchString, setSearchString] = useState('');
	const [items,, itemsMessages, isItemsLoading] = useLoad(`${endpoint}?search=${searchString}&searchFields=${textField}&orderby=${textField}`);
	const [selectedItems, setSelectedItems] = useState([]);
	// Handlers ---------------------------------------------------
	const addItem = (itemID) => setSelectedItems((prev) => [...prev, itemID]);
	const removeItem = (itemID) => setSelectedItems((prev) => prev.filter((id) => id !== itemID));
	const handleSelect = (itemID) => {
		selectedItems.includes(itemID) ? removeItem(itemID) : addItem(itemID);
	};

	// View -------------------------------------------------------
	const noContent = () => {
		return itemsMessages;
	};
	const content = () => {
		return (
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
		);
	};
	return (
		<Modal onClose={onClose}>
			<div className="contentSelectorContainer">
				<header className='contentSelectorHeader'>
					<h1>{title}</h1>
				</header>
				<SearchBar searchString={searchString} setSearchString={setSearchString} placeholder="Search..." />
				{
					isItemsLoading || items.length == 0
						?
						noContent()
						:
						content()
				}
				<ButtonTray>
					<Button className={'formButton submitButton'} onClick={() => onSave(selectedItems)}>Save</Button>
					<Button className={'formButton cancelButton'} onClick={onClose}>Close</Button>
				</ButtonTray>
			</div>
		</Modal>
	);
};

export default ContentSelectorModal;
