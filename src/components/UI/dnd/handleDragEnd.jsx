import { arrayMove } from '@dnd-kit/sortable';

const handleDragEnd = (event, items, setItems, idField) => {
	const { active, over } = event;
	if (active.id !== over.id) {
		setItems((items) => {
			const oldIndex = items.findIndex((item) => item[idField] === active.id);
			const newIndex = items.findIndex((item) => item[idField] === over.id);
			return arrayMove(items, oldIndex, newIndex);
		});
	}
};

export default handleDragEnd;