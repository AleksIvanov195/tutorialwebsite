import API from '../api/API';
import CourseForm from '../components/enitity/forms/CourseForm';
import CollapsiblePanel from '../components/UI/CollapsiblePanel';
import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export default function CreateCourse() {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	// State ------------------------------------------------------
	const [courseMessage, setCourseMessage] = useState('');
	// Handlers ---------------------------------------------------
	const handleCourseSubmit = async (data) => {
		const response = await API.post('/courses', data, authState.isLoggedIn);
		if (response.isSuccess) {
			setCourseMessage('Course Creation successful!');
		} else {
			setCourseMessage(`Course Creation failed: ${response.message}`);
		}
	};

	// View -------------------------------------------------------
	return (
		<>
			<CollapsiblePanel header='Course Detail Form'>
				<CourseForm onSubmit={handleCourseSubmit} courseMessage = {courseMessage}/>
			</CollapsiblePanel>
			<CollapsiblePanel header='Course Content Structure'>
				<p>Here on one side we will have the available lessons and Quizzes and other content that can be added to the course.</p>
				<p>On the other side we will have the current structure of the course.</p>
				<p>The content creator will be able to move around the content, so that they can adjust the structure of the course.</p>
			</CollapsiblePanel>
		</>
	);
}