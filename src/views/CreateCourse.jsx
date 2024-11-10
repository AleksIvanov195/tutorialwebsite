import { useAuth } from '../hooks/useAuth';
import API from '../api/API';
import CourseForm from '../components/enitity/forms/CourseForm';
import CourseTray from '../components/UI/CourseTray';

export default function CreatorCourse() {
	// Inititalisation --------------------------------------------
	const { loggedInUser, loading } = useAuth();
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	const handleCourseSubmit = (data) => {
		API.post('/courses', data);
	};

	// View -------------------------------------------------------
	return (
		<>
			<CourseTray header='Course Detail Form'>
				<CourseForm onSubmit={handleCourseSubmit} />
			</CourseTray>
			<CourseTray header='Course Content Structure'>
				<p>Here on one side we will have the available lessons and Quizzes and other content that can be added to the course.</p>
				<p>On the other side we will have the current structure of the course.</p>
				<p>The content creator will be able to move around the content, so that they can adjust the structure of the course.</p>
			</CourseTray>
		</>
	);
}