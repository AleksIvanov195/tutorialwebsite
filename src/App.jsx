import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Homepage from './views/Homepage';
import './App.scss';

export default function App() {
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return(
		<BrowserRouter>
			<Layout>
				<Routes>
					<Route path ='/' element={<Homepage/>}/>
				</Routes>
			</Layout>
		</BrowserRouter>
	);
}