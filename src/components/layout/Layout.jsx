import Header from './Header';
import Footer from './Footer';
import Navbar from './Navbar';
import './Layout.scss';

export default function Layout(props) {
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	console.log(props)
	return (
		<div className = "layout">
			<Header/>
			<Navbar/>
			<main className= 'home-main'>
				{props.children}
			</main>
			<Footer />
		</div>
	);
}