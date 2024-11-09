import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.scss';
import Hamburger from 'hamburger-react';

export default function Navbar() {
	// Inititalisation --------------------------------------------
	const { loggedInUser, loading } = useAuth();
	// State ------------------------------------------------------
	const [isOpen, setIsOpen] = useState(false);
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	if (loading) return <p>Loading User info...</p>;
	if (!loggedInUser) return <p>User not logged in.</p>;
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
				{
					loggedInUser.UserType == 'ContentCreator' && <li><NavLink to="/creatordashboard">Creator Dashboard</NavLink></li>
				}
			</ul>
		</nav>
	);
}

