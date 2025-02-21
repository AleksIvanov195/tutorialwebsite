import { useState } from 'react';
import Collapse from 'react-collapse';
import Icons from './Icons';
import './CollapsiblePanel.scss';

export default function CollapsiblePanel({ children, header }) {
	const [isCollapsed, setIsCollapsed] = useState(false);

	const handleToggle = () => {
		setIsCollapsed(!isCollapsed);
	};

	return (
		<div className={`collapsiblePanel ${isCollapsed ? 'isActive' : ''}`}>
			<div className="collapsiblePanelHeader" onClick={handleToggle}>
				<h1>{header}</h1>
				<span>
					<Icons.ArrowRight />
				</span>
			</div>
			<Collapse isOpened={isCollapsed}>
				<div className="collapsiblePanelContent">{children}</div>
			</Collapse>
		</div>
	);
}