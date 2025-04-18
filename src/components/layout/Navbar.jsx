import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { Button, ButtonTray } from '../UI/Buttons';
import './Navbar.scss';
import Hamburger from 'hamburger-react';
import toast from 'react-hot-toast';
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
				<li><NavLink to="/topics"><a onClick={() => toast.error('Topics page does not exist yet!')}>Topics</a></NavLink></li>
				<li><NavLink to="/exercises"><a onClick={() => toast.error('Exercises page does not exist yet!')}>Exercises</a></NavLink></li>
				{
					authState.role == 'ContentCreator' && <li><NavLink to="/creatordashboard" onClick={() => handleChangeLocation('Dashboard')}>Creator Dashboard</NavLink></li>
				}
				<li className='navButtons'>
					{
						authState.isLoggedIn
							?
							<ButtonTray>
								<Button className="headerButton">Profile</Button>
								<Button className="headerButton" onClick={logout}>Logout</Button>
							</ButtonTray>
							:
							<ButtonTray className={'headerButtonTray'}>
								<NavLink to="/login" className={'noUnderline'}>
									<Button className="headerButton">Log In</Button>
								</NavLink>
								<NavLink to="/register" className={'noUnderline'}>
									<Button className="headerButton">Register</Button>
								</NavLink>
							</ButtonTray>
					}

				</li>
			</ul>
		</nav>
	);
}

