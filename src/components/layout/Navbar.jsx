import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.scss';
import Hamburger from 'hamburger-react';
export default function Navbar() {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth()
	// State ------------------------------------------------------
	const [isOpen, setIsOpen] = useState(false);
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return (
		<nav className="navbar">
			<div className="hamburger">
				<Hamburger toggled={isOpen} toggle={setIsOpen} />
			</div>
			<ul className={`navLinks ${isOpen ? 'show' : ''}`}>
				<li><NavLink to="/">Home</NavLink></li>
				<li><NavLink to="/courses">Courses</NavLink></li>
				<li><a>Topics</a></li>
				<li><a>Exercises</a></li>
				<li><NavLink to="/login">login</NavLink></li>
				{
					authState.role == 'ContentCreator' && <li><NavLink to="/creatordashboard">Creator Dashboard</NavLink></li>
				}
			</ul>
		</nav>
	);
}

