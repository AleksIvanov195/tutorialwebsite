import './ContentPanel.scss';

export const ContentItem = ({ title, onClick, isSelected, children, enableOptions = true, completed = false, titleIcon }) => {

	return (
		<>
			<div
				className={`contentItem ${completed ? 'contentCompleted' : isSelected ? 'selected' : ''}`}
				onClick={onClick}
				title={title}
			>
				{titleIcon && (
					<span className="titleIconContainer">
						{titleIcon}
					</span>
				)}
				<h3 className="contentItemText">
					{title}
				</h3>
			</div>
			{isSelected && enableOptions && (
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