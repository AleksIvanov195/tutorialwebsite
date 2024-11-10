import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import Homepage from './views/Homepage';
import Course from './views/Course';
import CreatorDashboard from './views/CreatorDashboard';
import CreateCourse from './views/CreateCourse';
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
						<Route path ='/courses' element={<Course/>}/>
						<Route path ='/creatordashboard' element={<CreatorDashboard/>}/>
						<Route path ='/createcourse' element={<CreateCourse />}/>
					</Routes>
				</Layout>
			</BrowserRouter>
		</AuthProvider>
	);
}