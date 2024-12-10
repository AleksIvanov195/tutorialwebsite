import './Header.scss';
import Navbar from './Navbar';
import { useAuth } from '../../hooks/useAuth';
import { NavLink } from 'react-router-dom';

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
						<>
							<NavLink to="/login">
								<button>Log In</button>
							</NavLink>
							<NavLink to="/register">
								<button>Register</button>
							</NavLink>
						</>
						:
						<>
							<button>Profile</button>
							<button onClick={logout}>Logout</button>
						</>
				}

			</div>
		</header>

	);
}

