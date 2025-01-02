import RichTextEditor from '../components/UI/RichTextEditor';

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
	};
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return (
		<div>
			<h1>Create Lesson</h1>
			<RichTextEditor options = {editorOptions}/>
		</div>
	);
};

export default LessonCreator;