import { Button } from './Buttons';
import './HoverMenu.scss';

const HoverMenu = ({ label, children }) => {

	return (
		<div className="hovermenu">
			<Button className="hoverButton">
				{label} <span className="arrow">▶</span>
			</Button>
			<div className="content">{children}</div>
		</div>
	);
};

export default HoverMenu;
