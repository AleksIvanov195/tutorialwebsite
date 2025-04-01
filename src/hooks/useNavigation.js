import { useNavigate } from 'react-router-dom';

const useNavigation = () => {
	const navigate = useNavigate();

	const navigateToLessonEditor = (lessonID) => {
		navigate('/lessoneditor', { state: { lessonID } });
	};

	const navigateToQuizEditor = (quizID) => {
		navigate('/quizeditor', { state: { quizID } });
	};

	const navigateToCourseEditor = (courseID) => {
		navigate('/courseeditor', { state: { courseID } });
	};

	const navigateToCourseView = (courseID, userCourseID = null) => {
		navigate('/courseview', { state: { courseID, userCourseID } });
	};

	return { navigateToLessonEditor, navigateToQuizEditor, navigateToCourseEditor, navigateToCourseView };
};

export default useNavigation;
