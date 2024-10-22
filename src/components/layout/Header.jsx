import './Header.scss';
import '../styles/variables.scss';
import Navbar from './Navbar';

export default function Header() {
	return (
		<header className="header">
			<div className="logo">
				<img src="https://placehold.co/600x400" alt="Logo" />
			</div>
			<Navbar />
			<button>Sign In</button>
			<button>Sign Up</button>
		</header>
	);
}

