import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import Homepage from './views/Homepage';
import Course from './views/Course';
import Login from './views/Login';
import Register from './views/Register';
import './App.scss';

// Lazy load components
const CreatorDashboard = lazy(() => import('./views/CreatorDashboard'));
const CreateCourse = lazy(() => import('./views/CreateCourse'));
const LessonEditor = lazy(() => import('./views/LessonEditor'));
const PreviewRichTextContent = lazy(() => import('./views/PreviewRichTextContent'));

// Error boundary for lazy loaded components
const ErrorBoundary = ({ children }) => {
	return (
		<Suspense fallback={<div>Loading component...</div>}>
			{children}
		</Suspense>
	);
};

// Protected route component
const ProtectedRoute = ({ isAllowed, redirectPath = '/login', children }) => {
	if (!isAllowed) {
		return <Navigate to={redirectPath}/>;
	}
	return children;
};

// AppContent Component
const AppContent = () => {
	const { authState } = useAuth();

	if (authState.loading) {
		return <div>Loading...</div>;
	}
	const isAuthenticated = authState.isLoggedIn;

	return (
		<Routes>
			{/* Public Routes ------------------------------------------*/}
			<Route path="/" element={<Homepage />} />
			<Route path="/courses" element={<Course />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/preview" element={<PreviewRichTextContent />} />

			{/* Content Creator routes ----------------------------------*/}
			<Route
				path="/creatordashboard"
				element={
					<ProtectedRoute isAllowed={isAuthenticated && authState.role === 'ContentCreator'}>
						<ErrorBoundary>
							<CreatorDashboard />
						</ErrorBoundary>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/createcourse"
				element={
					<ProtectedRoute isAllowed={isAuthenticated && authState.role === 'ContentCreator'}>
						<ErrorBoundary>
							<CreateCourse />
						</ErrorBoundary>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/lessoneditor"
				element = {
					<ProtectedRoute isAllowed={isAuthenticated && authState.role === 'ContentCreator'}>
						<ErrorBoundary>
							<LessonEditor/>
						</ErrorBoundary>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/preview"
				element = {
					<ProtectedRoute isAllowed={isAuthenticated && authState.role === 'ContentCreator'}>
						<ErrorBoundary>
							<PreviewRichTextContent/>
						</ErrorBoundary>
					</ProtectedRoute>
				}
			/>
			<Route path="*" element={<Navigate to="/"/>} />
		</Routes>
	);
};

// Main App Component
export default function App() {
	return (
		<AuthProvider>
			<BrowserRouter>
				<Layout>
					<AppContent />
				</Layout>
			</BrowserRouter>
		</AuthProvider>
	);
}
