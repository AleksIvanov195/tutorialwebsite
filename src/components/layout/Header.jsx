import './Header.scss';
import Navbar from './Navbar';
import { useAuth } from '../../hooks/useAuth';
import { NavLink } from 'react-router-dom';
import { Button, ButtonTray } from '../UI/Buttons';

export default function Header() {
	// Inititalisation --------------------------------------------
	const { authState, logout } = useAuth();
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return (
		<header className="header">
			<div className="navContainer">
				<div className="logo">
					<img src="https://placehold.co/600x400" alt="Logo" />
				</div>
				<Navbar />
			</div>
			<div className="buttons">
				{
					!authState.isLoggedIn
						?
						<ButtonTray className={'headerButtonTray'}>
							<NavLink to="/login" className={'noUnderline'}>
								<Button className="headerButton">Log In</Button>
							</NavLink>
							<NavLink to="/register" className={'noUnderline'}>
								<Button className="headerButton">Register</Button>
							</NavLink>
						</ButtonTray>
						:
						<ButtonTray className={'headerButtonTray'}>
							<Button className="headerButton">Profile</Button>
							<Button className="headerButton" onClick={logout}>Logout</Button>
						</ButtonTray>
				}

			</div>
		</header>

	);
}

