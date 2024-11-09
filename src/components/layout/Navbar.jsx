import { useState } from 'react';
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
				<li><a>Home</a></li>
				<li><a>Courses</a></li>
				<li><a>Topics</a></li>
				<li><a>Exercises</a></li>
			</ul>
		</nav>
	);
}

