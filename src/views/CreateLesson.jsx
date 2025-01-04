import RichTextEditor from '../components/UI/RichTextEditor';
import { useAuth } from '../hooks/useAuth';
import API from '../api/API';
import useLoad from '../api/useLoad';
import RenderContentViaHtml from '../components/utility/RenderContentViaHtml ';
import RenderContentWithEditor from '../components/utility/RenderContentWithEditor';
const LessonCreator = () => {
	// Inititalisation --------------------------------------------
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
	const { authState } = useAuth();
	const [lessons, , , isLoading ] = useLoad('/lessons', authState.isLoggedIn);
	console.log(lessons);
	if (isLoading == false) {
		const lessonContent = JSON.parse(lessons[0].LessonContentJSON);
		console.log(lessonContent);
	}

	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------

	const handleSaveLesson = async (data) =>{
		const lessonData = { LessonName: 'TestLesson', LessonDescription: 'TestDescription', LessonContentJSON: data };
		const response = await API.post('/lessons', lessonData, authState.isLoggedIn);
		console.log(response);
	};
	// View -------------------------------------------------------
	return (
		<div>
			<h1>Create Lesson</h1>
			{isLoading ? (
				<p>Loading lesson content...</p>
			) : (
				<>
					<RenderContentViaHtml contentJSON={JSON.parse(lessons[1].LessonContentJSON)} />
					<RenderContentWithEditor contentJSON={JSON.parse(lessons[1].LessonContentJSON)} readOnly={true} />
				</>
			)}
			<RichTextEditor options = {editorOptions} handleSave = {handleSaveLesson}/>
		</div>
	);
};

export default LessonCreator;