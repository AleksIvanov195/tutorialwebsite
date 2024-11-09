import './Header.scss';
import '../styles/variables.scss';
import Navbar from './Navbar';
import { useAuth } from '../../hooks/useAuth';

export default function Header() {
	// Inititalisation --------------------------------------------
	const { login } = useAuth();
	const learner = {
		UserType:'Learner',
	};
	const CC = {
		UserType: 'ContentCreator',
	};
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	const handleLogin = (user) =>{
		login(user);
	};
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
				<button onClick={() => handleLogin(CC)}>sign in</button>
				<button>sign up</button>
			</div>
		</header>

	);
}

