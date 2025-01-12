import { useState } from 'react';
import Collapse from 'react-collapse';
import './CollapsiblePanel.scss';

export default function CollapsiblePanel({ children, header }) {
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
			<div className={`collapsiblePanel ${isCollapsed ? 'isActive' : ''} `}>
				<div className="collapsiblePanelHeader" onClick={handleToggle}>
					<h1>{header}</h1>
					<span>{isCollapsed ? '▼' : '▲'}</span>
				</div>
				<Collapse isOpened={isCollapsed}>
					<div className="collapsiblePanelContent">{children}</div>
				</Collapse>
			</div>
		</>
	);
}

