import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import Homepage from './views/Homepage';
import './App.scss';

export default function App() {
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return(
		<AuthProvider>
			<BrowserRouter>
				<Layout>
					<Routes>
						<Route path ='/' element={<Homepage/>}/>
					</Routes>
				</Layout>
			</BrowserRouter>
		</AuthProvider>
	);
}