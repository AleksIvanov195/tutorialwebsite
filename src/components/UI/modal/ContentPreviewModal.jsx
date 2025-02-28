import useLoad from '../../../api/useLoad';
import Modal from './Modal';
import { Button, ButtonTray } from '../Buttons';
import './ContentSelectorModal.scss';

const ContentPreviewModal = ({ endpoint, idField, textField, onClose, title, onSave, onSaveText = 'Save' }) => {
	// State ------------------------------------------------------
	const [items,, itemsMessages, isItemsLoading] = useLoad(endpoint);

	// View -------------------------------------------------------
	const noContent = () => {
		return itemsMessages;
	};
	const content = () => {
		return (
			<ul>
				{items.map((item, index) => (
					<li key={item[idField]}>
						<span>{index + 1}. {item[textField]}</span>
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
				{
					isItemsLoading || items.length == 0
						?
						noContent()
						:
						content()
				}
				<ButtonTray>
					<Button className={'formButton submitButton'} onClick={onSave}>{onSaveText}</Button>
					<Button className={'formButton cancelButton'} onClick={onClose}>Close</Button>
				</ButtonTray>
			</div>
		</Modal>
	);
};

export default ContentPreviewModal;