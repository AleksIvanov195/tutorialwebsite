import RichTextEditor from '../components/UI/RichTextEditor';
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../api/API';
import useLoad from '../api/useLoad';
import LessonForm from '../components/enitity/forms/LessonForm';
import Modal from '../components/UI/Modal';
const LessonEditor = () => {
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
	const [lesson, setLesson, , isLoading ] = useLoad(`/lessons?LessonID=${lessonID}`, authState.isLoggedIn);
	const [showModal, setShowModal] = useState(false);
	const [lessonUpdateMessage, setLessonUpdateMessage] = useState('');
	// Handlers ---------------------------------------------------
	const handleSaveLessonContent = async (data, status) =>{
		const lessonData = { LessonContentJSON: data, LessonPublicationstatusID: status };
		const response = await API.put(`/lessons/${lesson[0].LessonID}`, lessonData, authState.isLoggedIn);
	};
	const handleSaveLessonDetails = async (data)=>{
		const response = await API.put(`/lessons/${lesson[0].LessonID}`, data, authState.isLoggedIn);
		if (response.isSuccess) {
			setLesson([
				{ ...lesson[0], LessonName: data.LessonName, LessonDescription: data.LessonDescription },
			]);
			setLessonUpdateMessage('Lesson details have been updated.');
		}else{
			setLessonUpdateMessage(`Lesson Update failed: ${response.message}`);
		}
	};
	const openModal = () =>{
		setShowModal(!showModal);
		setLessonUpdateMessage('');
	};
	// View -------------------------------------------------------
	return (
		<div>
			{isLoading ? (
				<>
					<h1>Lesson Editor</h1>
					<p>Loading lesson content...</p>
				</>
			) : (
				<>
					<h1>Editing {lesson[0].LessonName}</h1>
					{
						showModal &&
						<Modal>
							<LessonForm
								initialValues={{ LessonName: lesson[0].LessonName, LessonDescription: lesson[0].LessonDescription }}
								lessonMessage={lessonUpdateMessage}
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
				</>
			)}

		</div>
	);
};

export default LessonEditor;