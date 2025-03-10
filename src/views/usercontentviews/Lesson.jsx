import RenderContentWithEditor from '../../components/utility/RenderContentWithEditor';
import useLoad from '../../api/useLoad';
import './Lesson.scss';
const Lesson = ({ lessonID }) => {
	const [lesson, setLesson, , isLoading ] = useLoad(`/lessons/${lessonID}`);
	if(isLoading) {
		return <p>Loading .....</p>;
	}
	return (

		<div className = "previewContent">
			<RenderContentWithEditor contentJSON={JSON.parse(lesson[0].LessonContentJSON)} readOnly={true} />
		</div>
	);
};

export default Lesson;