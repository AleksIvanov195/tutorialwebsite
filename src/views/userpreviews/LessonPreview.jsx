import RenderContentWithEditor from '../../components/utility/RenderContentWithEditor';
import useLoad from '../../api/useLoad';
import './LessonPreview.scss';
const LessonPreview = ({ lessonID }) => {
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

export default LessonPreview;