import Header from './Header';
import Footer from './Footer';
import Navbar from './Navbar';
import './Layout.scss';

export default function Layout(props) {
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return (
		<div className = "layout">
			<Header/>
			<Navbar/>
			<main>
				{props.children}
			</main>
			<Footer />
		</div>
	);
}