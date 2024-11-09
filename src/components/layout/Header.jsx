import './Header.scss';
import '../styles/variables.scss';
import Navbar from './Navbar';

export default function Header() {
	return (
		<header className="header">
			<div className="navContainer">
				<div className="logo">
					<img src="https://placehold.co/600x400" alt="Logo" />
				</div>
				<Navbar />
			</div>
			<div className="buttons">
				<button>sign in</button>
				<button>sign up</button>
			</div>
		</header>

	);
}

