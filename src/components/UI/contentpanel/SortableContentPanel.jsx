import { ContentItem, ContentPanel } from './ContentPanel';
import DndContext from '../dnd/DndContext';
import SortableItem from '../dnd/SortableItem';
import handleDragEnd from '../dnd/handleDragEnd';

export const SortableContentItem = ({ id, title, onClick, isSelected, children }) => {
	return (
		<SortableItem id={id}>
			<ContentItem title={title} onClick={onClick} isSelected={isSelected}>
				{children}
			</ContentItem>
		</SortableItem>
	);
};

export const SortableContentPanel = ({ children, title, items, setItems, idField }) => {
	const onDragEnd = (event) => {
		handleDragEnd(event, items, setItems, idField);
	};

	return (
		<DndContext items={items} onDragEnd={onDragEnd} idField={idField}>
			<ContentPanel title={title}>
				{children}
			</ContentPanel>
		</DndContext>
	);
};
