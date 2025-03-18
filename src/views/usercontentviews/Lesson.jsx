import RenderContentWithEditor from '../../components/utility/RenderContentWithEditor';
import useLoad from '../../api/useLoad';
import { Button, ButtonTray } from '../../components/UI/Buttons';
import toast from 'react-hot-toast';
import './Lesson.scss';
const Lesson = ({ lessonID, loadCourseContent, isEditing = false }) => {
	const [lesson, setLesson, , isLoading ] = useLoad(`/lessons/${lessonID}`);
	if(isLoading) {
		return <p>Loading .....</p>;
	}
	const completeLesson = () => {
		toast.success('Marked as complete');

	};
	return (

		<div className = "previewContent">
			<h2 className='startOfLesson'>{lesson[0].LessonName}</h2>
			<RenderContentWithEditor contentJSON={JSON.parse(lesson[0].LessonContentJSON)} readOnly={true} />
			<p className='endOfLesson'><span>End of Lesson</span></p>
			<ButtonTray>
				<Button disabled = {isEditing} onClick={() => completeLesson()}>Mark as completed</Button>
			</ButtonTray>
		</div>
	);
};

export default Lesson;