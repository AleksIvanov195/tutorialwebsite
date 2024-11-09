import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.scss';
import Hamburger from 'hamburger-react';

export default function Navbar() {
	// Inititalisation --------------------------------------------
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
			</ul>
		</nav>
	);
}

