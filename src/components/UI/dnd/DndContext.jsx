import { DndContext as DndKitContext, closestCenter } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';

const DndContext = ({ items, onDragEnd, children, idField }) => {
	const itemIds = items.map((item) => item[idField]);
	return (
		<DndKitContext collisionDetection={closestCenter} onDragEnd={onDragEnd}>
			<SortableContext items={itemIds}>
				{children}
			</SortableContext>
		</DndKitContext>
	);
};

export default DndContext;