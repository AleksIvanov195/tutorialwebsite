import RichTextEditor from '../../components/UI/RichTextEditor';
import { useAuth } from '../../hooks/useAuth';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../../api/API';
import useLoad from '../../api/useLoad';
import LessonForm from '../../components/enitity/forms/LessonForm';
import Modal from '../../components/UI/Modal';
import toast from 'react-hot-toast';
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
	const [lesson, setLesson, , isLoading ] = useLoad(`/lessons/${lessonID}`, authState.isLoggedIn);
	const [showModal, setShowModal] = useState(false);
	// Handlers ---------------------------------------------------
	const handleSaveLessonContent = async (data, status) =>{
		const toastId = toast.loading('Saving...');
		const lessonData = { LessonContentJSON: data, LessonPublicationstatusID: status };
		const response = await API.put(`/lessons/${lesson[0].LessonID}/content-status`, lessonData, authState.isLoggedIn);
		if(response.isSuccess) {
			toast.success('Lesson Saved.', { id:toastId });
		}else{
			toast.error(`Lesson could not be saved. ${response.message}`, { id:toastId });
		}
	};
	const handleSaveLessonDetails = async (data)=>{
		const toastId = toast.loading('Saving...');
		const response = await API.put(`/lessons/${lesson[0].LessonID}/name-description`, data, authState.isLoggedIn);
		if (response.isSuccess) {
			setLesson([
				{ ...lesson[0], LessonName: data.LessonName, LessonDescription: data.LessonDescription },
			]);
			toast.success('Lesson details have been updated.', { id:toastId });
		}else{
			toast.error(`Lesson detail could not be updated. ${response.message}`, { id:toastId });
		}
	};
	const openModal = () =>{
		setShowModal(!showModal);
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
			<h1>Editing {lesson[0].LessonName}</h1>
			{
				showModal &&
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