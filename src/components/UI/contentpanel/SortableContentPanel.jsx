import { ContentItem, ContentPanel } from './ContentPanel';
import DndContext from '../dnd/DndContext';
import SortableItem from '../dnd/SortableItem';
import handleDragEnd from '../dnd/handleDragEnd';

export const SortableContentItem = ({ id, title, onClick, isSelected, children, isReordering, titleIcon }) => {

	return (
		isReordering ?
			<SortableItem id={id}>
				<ContentItem title={title} onClick={onClick} titleIcon={titleIcon}/>
			</SortableItem>
	 		:
			<ContentItem title={title} onClick={onClick} isSelected={isSelected} titleIcon={titleIcon}>
				{children}
			</ContentItem>
	);
};

export const SortableContentPanel = ({ children, title, items, setItems, idField, isReordering }) => {
	const onDragEnd = (event) => {
		handleDragEnd(event, items, setItems, idField);
	};

	return (
		<ContentPanel title={title}>
			{isReordering ?
				<DndContext items={items} onDragEnd={onDragEnd} idField={idField}>
					{children}
				</DndContext>
			 :
				children
			}
		</ContentPanel>
	);
};
