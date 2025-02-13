import { useAuth } from '../../hooks/useAuth';
import useLoad from '../../api/useLoad';
import API from '../../api/API';
import { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { SortableContentItem, SortableContentPanel } from '../../components/UI/contentpanel/SortableContentPanel';
import { Button, ButtonTray } from '../../components/UI/Buttons';
import LessonPreview from '../userpreviews/lessonpreview';
import QuizUserView from '../userpreviews/QuizUserView';
import Icons from '../../components/UI/Icons';
import toast from 'react-hot-toast';
import './CourseEditor.scss';
const CourseEditor = () =>{
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	const location = useLocation();
	const navigate = useNavigate();
	const { courseID } = location.state || { courseID: null };
	// State ------------------------------------------------------
	const [courseContent, setCourseContent, , isLoading, loadCourseContent ] = useLoad('/coursecontents/simplified?CoursecontentCourseID=1&orderby=CoursecontentOrder,ASC', authState.isLoggedIn);
	const [selectedCourseContent, setSelectedCourseContent] = useState(null);
	const [isReordering, setIsReordering] = useState(false);
	const initialCourseContent = useRef([]);
	// Handlers ---------------------------------------------------
	const handleItemClick = (content) => {
		setSelectedCourseContent(content);
	};
	const handleNavigateToEditor = () =>{
		if(selectedCourseContent.ContentType == 'Lesson') {
			navigate('/lessoneditor', { state: { lessonID: selectedCourseContent.ContentID } });
		} else if(selectedCourseContent.ContentType == 'Quiz') {
			navigate('/quizeditor', { state: { quizID: selectedCourseContent.ContentID } });
		}else{
			toast.error('Something went wrong, please try again!');
		}
	};
	const handleRemoveContentFromCourse = async () => {
		const toastId = toast.loading(`Removing ${selectedCourseContent.ContentType}...`);
		const response = await API.delete(`/coursecontents/${selectedCourseContent.CoursecontentID}`);
		if (response.isSuccess) {
			loadCourseContent();
			toast.success(`${selectedCourseContent.ContentType} has been removed.`, { id:toastId });
			setSelectedCourseContent(null);
		}else {
			toast.error(`${selectedCourseContent.ContentType} could not be removed. ${response.message}`, { id:toastId });
		}
	};
	const handleSubmitReorderedContent = async () => {
		const toastId = toast.loading('Updating Content...');
		try{
			await Promise.all(
				courseContent.map((content, index) =>
					API.put(`/coursecontents/${content.CoursecontentID}`, { CoursecontentOrder : index + 1 }, authState.isLoggedIn),
				),
			);
			setIsReordering(false);
			loadCourseContent();
			toast.success('Content Reordered.', { id:toastId });
		}catch (error) {
			setIsReordering(false);
			toast.error(`Something went wrong while reordering, please try again!, ${error}`, { id:toastId });
		}

	};
	const toggleReordering = () => {
		if (isReordering) {
			// Revert to initial order if reordering is canceled
			setCourseContent(initialCourseContent.current);
			toast.error('Reordering cancelled.');
		} else {
			// Store the initial order before reordering
			initialCourseContent.current = courseContent;
			toast.success('Reordering enabled.');
		}
		setIsReordering(!isReordering);
	};
	// View -------------------------------------------------------
	const contentView = () => {
		if (selectedCourseContent.ContentType === 'Lesson') {
			return <LessonPreview lessonID={selectedCourseContent.ContentID} />;
		} else if (selectedCourseContent.ContentType === 'Quiz') {
			return <QuizUserView quizID={selectedCourseContent.ContentID} />;
		}
		return null;
	};
	if(isLoading) {
		return(
			<>
				<p>Loading content...</p>
			</>
		);
	}
	return(
		<div className="courseEditor">
			<header className="courseEditorHeader">
				<h1>Hi</h1>
			</header>
			<div className="courseEditorBody">
				<SortableContentPanel
					title="List of Content"
					items={courseContent}
					setItems={setCourseContent}
					idField="CoursecontentID"
					isReordering={isReordering}>
					<ButtonTray>
						<Button icon={<Icons.Publish size={25} />} onClick={handleSubmitReorderedContent} title="Save changes" />
						<Button icon={<Icons.Close size={25} />} onClick={toggleReordering} title="Cancel Reordering" />
					</ButtonTray>
					{courseContent.map((content) => (
						<SortableContentItem
							key={content.CoursecontentID}
							id={content.CoursecontentID}
							title={`${content.ContentType}: ${content.ContentName}`}
							onClick={() => handleItemClick(content)}
							isSelected={selectedCourseContent?.CoursecontentID === content.CoursecontentID}
							isReordering={isReordering}>
							<span className="option" onClick={handleNavigateToEditor}><Icons.Edit />Edit {content.ContentType}</span>
							<span className="option delete" onClick={handleRemoveContentFromCourse}><Icons.Delete />Remove {content.ContentType}</span>
						</SortableContentItem>
					))}
					{
						// TO DO: Options below each item, remove from course, option to edit the item if quiz go to quiz editor if lesson go to lesson editor
						// When you click on a item the options appear below the item and the item is loaded on the right side of the screen.
					}

				</SortableContentPanel>

				<div className="courseEditorContent">
					{selectedCourseContent && contentView()}
				</div>
			</div>
		</div>

	);
};

export default CourseEditor;