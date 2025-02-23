import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, ButtonTray } from '../UI/Buttons';
import './Navbar.scss';
import Hamburger from 'hamburger-react';
export default function Navbar() {
	// Inititalisation --------------------------------------------
	const { authState, logout } = useAuth();
	const [currentLocation, setCurrentLocation] = useState('');
	// State ------------------------------------------------------
	const [isHamburgerOpen, setIsHambrugerOpen] = useState(false);
	// Handlers ---------------------------------------------------
	const handleChangeLocation = (name) => {
		setCurrentLocation(name);
	};
	useEffect(() => {
		const path = window.location.pathname;

		if (path === '/') {
			setCurrentLocation('Home');
		} else if (path === '/courses') {
			setCurrentLocation('Courses');
		} else if (path === '/creatordashboard') {
			setCurrentLocation('Dashboard');
		} else {
			setCurrentLocation('');
		}
	}, []);
	// View -------------------------------------------------------
	return (
		<nav className="navbar">
			<div className="hamburger">
				<Hamburger toggled={isHamburgerOpen} toggle={setIsHambrugerOpen} />
			</div>
			{!isHamburgerOpen &&
			<div className="activeLinkDisplay">
				{currentLocation && <span className='currentLocation'>{currentLocation}</span>}
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
				<li className='navButtons'>
					<ButtonTray>
						<Button className="headerButton">Profile</Button>
						<Button className="headerButton" onClick={logout}>Logout</Button>
					</ButtonTray>
				</li>
			</ul>
		</nav>
	);
}

