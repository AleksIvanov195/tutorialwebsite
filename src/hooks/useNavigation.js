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

	const navigateToCoursePreview = (courseID) => {
		navigate('/coursepreview', { state: { courseID } });
	};

	return { navigateToLessonEditor, navigateToQuizEditor, navigateToCourseEditor, navigateToCoursePreview };
};

export default useNavigation;
