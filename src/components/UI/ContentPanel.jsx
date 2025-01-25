import './ContentPanel.scss';

export const ContentItem = ({ title, onClick, isSelected, children }) => {

	return (
		<>
			<div className={`contentItem ${isSelected ? 'selected' : ''}`} onClick={onClick} title={title}>
				<h3 className="contentItemText">{title}</h3>
			</div>
			{isSelected && (
				<div className="contentItemOptions">
					{children}
				</div>
			)}
		</>
	);
};

export const ContentPanel = ({ children, title }) => {
	return (
		<div className="contentPanel">
			<div className = "panelHeader">{title}</div>
			{children}
		</div>
	);
};