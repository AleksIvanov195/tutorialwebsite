import { useState } from 'react';
import Collapse from 'react-collapse';
import './CourseTray.scss';

export default function CourseTray({ children, header }) {
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	const [isCollapsed, setIsCollapsed] = useState(false);
	// Handlers ---------------------------------------------------
	const handleToggle = () => {
		setIsCollapsed(!isCollapsed);
	};
	// View -------------------------------------------------------
	return (
		<>
			<div className='courseTray'>
				<div className="courseTrayHeader" onClick={handleToggle}>
					<h1>{header}</h1>
					<span>{isCollapsed ? '▼' : '▲'}</span>
				</div>
				<Collapse isOpened={isCollapsed}>
					<div className="courseTrayContent">{children}</div>
				</Collapse>
			</div>
		</>
	);
}