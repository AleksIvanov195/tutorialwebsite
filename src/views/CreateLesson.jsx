import RichTextEditor from '../components/UI/RichTextEditor';
import { useAuth } from '../hooks/useAuth';
import { useLocation } from 'react-router-dom';
import API from '../api/API';
import useLoad from '../api/useLoad';
const LessonCreator = () => {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	const location = useLocation();
	const { lessonID } = location.state || { lessonID: null };
	const editorOptions = {
		bold: true,
		italic: true,
		underline: true,
		codeBlock: true,
		bulletList: true,
		orderedList: true,
		blockquote: true,
		image: true,
		link: true,
		highlight: true,
		heading: true,
		fontStyle: true,
	};
	// State ------------------------------------------------------
	const [lesson, , , isLoading ] = useLoad(`/lessons?LessonID=${lessonID}`, authState.isLoggedIn);
	// Handlers ---------------------------------------------------
	const handleSaveLesson = async (data) =>{
		const lessonData = { LessonContentJSON: data };
		const response = await API.put(`/lessons/${lesson[0].LessonID}`, lessonData, authState.isLoggedIn);
		console.log(response);
	};
	// View -------------------------------------------------------
	return (
		<div>
			<h1>Create Lesson</h1>
			{isLoading ? (
				<p>Loading lesson content...</p>
			) : (
				<RichTextEditor options = {editorOptions} handleSave = {handleSaveLesson} initialContent={JSON.parse(lesson[0].LessonContentJSON)}/>
			)}
		</div>
	);
};

export default LessonCreator;