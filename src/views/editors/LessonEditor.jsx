import RichTextEditor from '../../components/UI/RichTextEditor';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import useApiActions from '../../hooks/useApiActions';
import useLoad from '../../api/useLoad';
import LessonForm from '../../components/enitity/forms/LessonForm';
import Modal from '../../components/UI/modal/Modal';
import './LessonEditor.scss';
const LessonEditor = () => {
	// Inititalisation --------------------------------------------
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
	const { post, put, delete: deleteRequest, batchRequests } = useApiActions();
	// State ------------------------------------------------------
	const [lesson, setLesson, , isLoading ] = useLoad(`/lessons/${lessonID}`);
	const [showLessonModal, setShowLessonModal] = useState(false);
	// Handlers ---------------------------------------------------
	const handleSaveLessonContent = async (data, status) => {
		await put(`/lessons/${lesson[0].LessonID}/content-status`,
			{ LessonContentJSON: data, LessonPublicationstatusID: status },
			{
				successMessage: 'Lesson Status Updated.',
				errorMessage: 'Lesson Status Failed to Update.',
			},
		);
	};
	const handleSaveLessonDetails = async (data) => {
		const response = await put(`/lessons/${lesson[0].LessonID}/name-description`, data, {
			successMessage: 'Lesson details have been updated.',
			errorMessage: 'Lesson details could not be updated.',
		});
		if (response.isSuccess) {
			setLesson([{ ...lesson[0], LessonName: data.LessonName, LessonDescription: data.LessonDescription }]);
		}
	};
	const openModal = () =>{
		setShowLessonModal(!showLessonModal);
	};
	// View -------------------------------------------------------
	if(isLoading) {
		return(
			<>
				<h1>Lesson Editor</h1>
				<p>Loading lesson content...</p>
			</>
		);
	}
	return (
		<div>
			<header className='lessoEditorHeader'>
				<h1>{lesson[0].LessonName}</h1>
			</header>
			{
				showLessonModal &&
						<Modal>
							<LessonForm
								initialValues={{ LessonName: lesson[0].LessonName, LessonDescription: lesson[0].LessonDescription }}
								onSubmit={handleSaveLessonDetails}
								onClose={openModal}
								mode={'edit'}/>
						</Modal>
			}
			<RichTextEditor
				options = {editorOptions}
				handleSave = {handleSaveLessonContent}
				handleEditContentDetails = {openModal}
				initialContent={JSON.parse(lesson[0].LessonContentJSON)}/>
		</div>
	);
};

export default LessonEditor;