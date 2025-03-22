import RenderContentWithEditor from '../../components/utility/RenderContentWithEditor';
import useLoad from '../../api/useLoad';
import useApiActions from '../../hooks/useApiActions';
import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Button, ButtonTray } from '../../components/UI/Buttons';
import toast from 'react-hot-toast';
import './Lesson.scss';
const Lesson = ({ lessonID, loadCourseContent, isCompleted = false }) => {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	const { post, put, delete: deleteRequest, batchRequests } = useApiActions();
	// State ------------------------------------------------------
	const [lesson, setLesson, , isLoading ] = useLoad(`/lessons/${lessonID}`);
	const [isLessonCompleted, setIsLessonCompleted] = useState(isCompleted);
	// Handlers ---------------------------------------------------
	const completeLesson = async () => {
		if(authState.isLoggedIn) {
			const response = await post('/userlessons', {
				UserlessonUsercontentstatusID: 3,
				UserlessonCompletiondate: new Date().toISOString().replace('T', ' ').split('.')[0],
				UserlessonLessonID: lesson[0].LessonID,
			}, {
				successMessage: 'Lesson has been marked as completed.',
				errorMessage: 'Lesson could not be marked as completed, please try again!',
			});
			if(response.isSuccess) {
				setIsLessonCompleted(true);
				loadCourseContent();
			}
		}else{
			toast.error('You must log in to save your lesson progress!');;
		}
	};
	// View -------------------------------------------------------

	if(isLoading) {
		return <p>Loading .....</p>;
	}
	return (

		<div className = "previewContent">
			<h2 className='startOfLesson'>{lesson[0].LessonName}</h2>
			<RenderContentWithEditor contentJSON={JSON.parse(lesson[0].LessonContentJSON)} readOnly={true} />
			<p className='endOfLesson'><span>End of Lesson</span></p>
			<ButtonTray>
				<Button disabled = {isLessonCompleted} onClick={() => completeLesson()}>{isLessonCompleted ? 'Lesson completed' : 'Mark as completed'}</Button>
			</ButtonTray>
		</div>
	);
};

export default Lesson;