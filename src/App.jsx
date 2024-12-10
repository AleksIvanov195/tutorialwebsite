import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import auth from './api/authFunctions';
import Layout from './components/layout/Layout';
import Homepage from './views/Homepage';
import Course from './views/Course';
import CreatorDashboard from './views/CreatorDashboard';
import CreateCourse from './views/CreateCourse';
import Login from './views/Login';
import './App.scss';


const AppContent = () => {
	const { authState } = useAuth();

	if (authState.loading) {
		return <div>Loading...</div>;
	}
	return (
		<Routes>
			<Route path='/' element={<Homepage />} />
			<Route path='/courses' element={<Course />} />
			<Route path='/creatordashboard' element={<CreatorDashboard />} />
			<Route path='/createcourse' element={<CreateCourse />} />
			<Route path='/login' element={<Login />} />
		</Routes>
	);
};

export default function App() {
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return(
		<AuthProvider>
			<BrowserRouter>
				<Layout>
					<AppContent />
				</Layout>
			</BrowserRouter>
		</AuthProvider>
	);
}
