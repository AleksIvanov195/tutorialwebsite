import { NavLink } from 'react-router-dom';
import { Button, ButtonTray } from '../components/UI/Buttons';
import CourseCarousel from '../components/enitity/carousels/CourseCarousel';
import './Homepage.scss';
import useLoad from '../api/useLoad';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import useNavigation from '../hooks/useNavigation';
import useApiActions from '../hooks/useApiActions';
import { handleBookmarkCourse, handleStartCourse } from '../utilities/courseutils';
import ContentPreviewModal from '../components/UI/modal/ContentPreviewModal';

export default function Homepage() {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	const { post, delete: deleteRequest } = useApiActions();
	const { navigateToCourseView } = useNavigation();
	const coursesEndpoint = authState.isLoggedIn ? '/courses/users' : '/courses';
	// State ------------------------------------------------------
	const [courses, , , isCourseLoading, loadCourses] = useLoad(coursesEndpoint);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [showContentModal, setShowContentModal] = useState(false);
	// Handlers ---------------------------------------------------
	const handleCourseClicked = (course) => {
		setSelectedCourse(course);
		if (course.UsercontentstatusID == 1 || !authState.isLoggedIn) {
			setShowContentModal(true);
		} else {
			handleStartCourse(course, authState, post, navigateToCourseView);
		}
	};
	const handleCloseModal = () => {
		setShowContentModal(false);
		setSelectedCourse(null);
	};
	// View -------------------------------------------------------

	if (isCourseLoading) return <p>Loading courses...</p>;

	return (
		<>
			<h1>Welcome to Our Tutorial Website!</h1>
			<p>Explore our wide range of courses and improve your skills.</p>
			<CourseCarousel
				courses={courses}
				handleBookmarkCourse={(courseID, isBookmarked, bookmarkID) => handleBookmarkCourse(courseID, isBookmarked, bookmarkID, authState, deleteRequest, post, loadCourses)}
				handleCourseClicked={handleCourseClicked}
			/>
			<ButtonTray className={'formButtonTray'}>
				<NavLink to="/courses" className={'noUnderline'}>
					<Button>Browse All Courses</Button>
				</NavLink>
				<NavLink to="/topics" className={'noUnderline'}>
					<Button disabled={true}>Browse Topics</Button>
				</NavLink>
				<NavLink to="/exercises" className={'noUnderline'}>
					<Button disabled={true}>Browse Exercises</Button>
				</NavLink>
			</ButtonTray>
			{showContentModal && (
				<ContentPreviewModal
					endpoint={`/coursecontents/simplified?CoursecontentCourseID=${selectedCourse.CourseID}`}
					idField="CoursecontentID"
					textField="ContentName"
					onClose={handleCloseModal}
					onSave={() => handleStartCourse(selectedCourse, authState, post, navigateToCourseView)}
					onSaveText="Start"
					title='Review Course Contents'
				/>
			)}
		</>
	);
}