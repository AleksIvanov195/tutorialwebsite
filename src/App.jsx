import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './hooks/useAuth';
import Layout from './components/layout/Layout';
import Homepage from './views/Homepage';
import CoursesPage from './views/CoursesPage';
import Login from './views/Login';
import Register from './views/Register';
import { Toaster } from 'react-hot-toast';

// Lazy load components
const CreatorDashboard = lazy(() => import('./views/CreatorDashboard'));
const CourseEditor = lazy(() => import('./views/editors/CourseEditor'));
const LessonEditor = lazy(() => import('./views/editors/LessonEditor'));
const QuizEditor = lazy(() => import('./views/editors/QuizEditor'));
const QuizPreview = lazy(() => import('./components/enitity/quiz/QuizPreview.jsx'));
const PreviewRichTextContent = lazy(() => import('./views/PreviewRichTextContent'));
const Course = lazy(() => import('./views/usercontentviews/Course.jsx'));

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
			<Route path="/courses" element={<CoursesPage />} />
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />
			<Route path="/courseview" element={
				<ErrorBoundary>
					<Course/>
				</ErrorBoundary>
			}/>
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
				path="/courseeditor"
				element={
					<ProtectedRoute isAllowed={isAuthenticated && authState.role === 'ContentCreator'}>
						<ErrorBoundary>
							<CourseEditor />
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
				path="/quizeditor"
				element = {
					<ProtectedRoute isAllowed={isAuthenticated && authState.role === 'ContentCreator'}>
						<ErrorBoundary>
							<QuizEditor/>
						</ErrorBoundary>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/previewrichtextcontent"
				element = {
					<ProtectedRoute isAllowed={isAuthenticated && authState.role === 'ContentCreator'}>
						<ErrorBoundary>
							<PreviewRichTextContent/>
						</ErrorBoundary>
					</ProtectedRoute>
				}
			/>
			<Route
				path="/previewquiz"
				element = {
					<ProtectedRoute isAllowed={isAuthenticated && authState.role === 'ContentCreator'}>
						<ErrorBoundary>
							<QuizPreview/>
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
					<Toaster />
					<AppContent />
				</Layout>
			</BrowserRouter>
		</AuthProvider>
	);
}
