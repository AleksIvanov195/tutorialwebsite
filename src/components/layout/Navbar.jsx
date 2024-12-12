import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import './Navbar.scss';
import Hamburger from 'hamburger-react';
export default function Navbar() {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	const [currentLocation, setCurrentLocation] = useState('');
	// State ------------------------------------------------------
	const [isHamburgerOpen, setIsHambrugerOpen] = useState(false);
	// Handlers ---------------------------------------------------
	const handleChangeLocation = (name) => {
		setCurrentLocation(name);
	};
	// View -------------------------------------------------------
	return (
		<nav className="navbar">
			<div className="hamburger">
				<Hamburger toggled={isHamburgerOpen} toggle={setIsHambrugerOpen} />
			</div>
			{!isHamburgerOpen &&
			<div className="activeLinkDisplay">
				{currentLocation && <span>{currentLocation}</span>}
			</div>
			}
			<ul className={`navLinks ${isHamburgerOpen ? 'show' : ''}`}>
				<li><NavLink to="/" onClick={() => handleChangeLocation('Home')} >Home</NavLink></li>
				<li><NavLink to="/courses" onClick={() => handleChangeLocation('Courses')} >Courses</NavLink></li>
				<li><a>Topics</a></li>
				<li><a>Exercises</a></li>
				{
					authState.role == 'ContentCreator' && <li><NavLink to="/creatordashboard" onClick={() => handleChangeLocation('Dashboard')}>Creator Dashboard</NavLink></li>
				}
			</ul>
		</nav>
	);
}

