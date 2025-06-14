import useApiActions from '../../hooks/useApiActions';
import useLoad from '../../api/useLoad';
import useNavigation from '../../hooks/useNavigation';
import { useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { SortableContentItem, SortableContentPanel } from '../../components/UI/contentpanel/SortableContentPanel';
import { Button, ButtonTray } from '../../components/UI/Buttons';
import LessonPreview from '../usercontentviews/Lesson';
import QuizPreview from '../../components/enitity/quiz/QuizPreview';
import LessonForm from '../../components/enitity/forms/LessonForm';
import QuizForm from '../../components/enitity/forms/QuizForm';
import CourseForm from '../../components/enitity/forms/CourseForm';
import HoverMenu from '../../components/UI/HoverMenu';
import Modal from '../../components/UI/modal/Modal';
import ContentSelectorModal from '../../components/UI/modal/ContentSelectorModal';
import Icons from '../../components/UI/Icons';
import toast from 'react-hot-toast';
import Animate from '../../components/UI/Animate';
import './CourseEditor.scss';
const CourseEditor = () =>{
	// Inititalisation --------------------------------------------
	const { post, put, delete: deleteRequest, batchRequests } = useApiActions();
	const { navigateToLessonEditor, navigateToQuizEditor } = useNavigation();
	const location = useLocation();
	const { courseID } = location.state || { courseID: null };
	// State ------------------------------------------------------
	const [course, setQuiz, quizMessage, isCourseLoading, loadQuiz] = useLoad(`/courses/${courseID}`);
	const [courseContent, setCourseContent, , isLoading, loadCourseContent ] = useLoad(`/coursecontents/simplified?CoursecontentCourseID=${courseID}&orderby=CoursecontentOrder,ASC`);
	const [selectedCourseContent, setSelectedCourseContent] = useState(null);
	const [isReordering, setIsReordering] = useState(false);
	const [showLessonModal, setShowLessonModal] = useState(false);
	const [showQuizModal, setShowQuizModal] = useState(false);
	const [showForm, setShowForm] = useState({ show: false, type: '' });
	const [showEditCourseModal, setShowEditCourseModal] = useState(false);
	const initialCourseContent = useRef([]);
	// Handlers ---------------------------------------------------
	const handleItemClick = (content) => {
		if(content.ContentID === selectedCourseContent?.ContentID) {
			setSelectedCourseContent(null);
		}else{
			setSelectedCourseContent(content);
		}
	};
	const handleNavigateToEditor = () =>{
		if (selectedCourseContent.ContentType === 'Lesson') {
			navigateToLessonEditor(selectedCourseContent.ContentID);
		} else if (selectedCourseContent.ContentType === 'Quiz') {
			navigateToQuizEditor(selectedCourseContent.ContentID);
		} else {
			toast.error('Something went wrong, please try again!');
		}
	};
	const openForm = (type) =>{
		setShowForm({ show: !showForm.show, type });
	};
	const handleRemoveContentFromCourse = async () => {
		await deleteRequest(`/coursecontents/${selectedCourseContent.CoursecontentID}`, {
			successMessage: `${selectedCourseContent.ContentType} has been removed.`,
			errorMessage: `${selectedCourseContent.ContentType} could not be removed.`,
		});
		loadCourseContent();
		setSelectedCourseContent(null);
	};
	const handleSubmitReorderedContent = async () => {
		const requests = courseContent.map((content, index) =>{
			// Find the current content in the original courseContent array
			const initialContent = initialCourseContent.current.find((c) => c.CoursecontentID === content.CoursecontentID);
			// Only send a request if the order has changed
			if (initialContent && initialContent.CoursecontentOrder !== index + 1) {
				return put(`/coursecontents/${content.CoursecontentID}`, { CoursecontentOrder: index + 1 }, { showToast: false });
			}
			return null;
		}).filter(Boolean); // Remove falsy values like null
		await batchRequests(requests, {
			successMessage: 'Content has been reordered.',
			errorMessage: 'Something went wrong while reordering, please try again!',
		});
		setIsReordering(false);
		loadCourseContent();
	};
	const getCurrentOrder = () => {
		return courseContent[courseContent.length - 1]?.CoursecontentOrder || 0;
	};
	const handleAddExistingContent = async (ids) => {
		const requests = ids.map((id, index) =>
			post('/coursecontents', {
				CoursecontentCourseID: courseID,
				CoursecontentLessonID: showLessonModal ? id : null,
				CoursecontentQuizID: showQuizModal ? id : null,
				CoursecontentOrder: getCurrentOrder() + index + 1,
			}, { showToast: false }),
		);
		await batchRequests(requests, {
			successMessage: 'Content has been added.',
			errorMessage: 'Some content could not be added, please try again!',
		});
		loadCourseContent();
	};
	const handleLessonSubmit = async (data) => {
		const createLessonResponse = await post('/lessons', data, {
			successMessage: 'Lesson Created.',
			errorMessage: 'Lesson could not be created.',
		});
		if (createLessonResponse.isSuccess) {
			const attachResponse = await post('/coursecontents', {
				CoursecontentCourseID: courseID,
				CoursecontentLessonID: createLessonResponse.result.data.LessonID,
				CoursecontentQuizID: null,
				CoursecontentOrder: getCurrentOrder() + 1,
			}, {
				successMessage: 'Lesson Attached, redirecting to editor.',
				errorMessage: 'Lesson could not be attached.',
			});
			if (attachResponse.isSuccess) {
				navigateToLessonEditor(createLessonResponse.result.data.LessonID);
			}
		}
	};
	const handleQuizSubmit = async (data) => {
		const createQuizResponse = await post('/quizzes', data, {
			successMessage: 'Quiz Created.',
			errorMessage: 'Quiz could not be created.',
		});
		if (createQuizResponse.isSuccess) {
			const attachResponse = await post('/coursecontents', {
				CoursecontentCourseID: courseID,
				CoursecontentLessonID: null,
				CoursecontentQuizID: createQuizResponse.result.data.QuizID,
				CoursecontentOrder: getCurrentOrder() + 1,
			}, {
				successMessage: 'Quiz Attached, redirecting to editor.',
				errorMessage: 'Quiz could not be attached.',
			});
			if (attachResponse.isSuccess) {
				navigateToQuizEditor(createQuizResponse.result.data.QuizID);
			}
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
	const openModal = () =>{
		setShowEditCourseModal(!showEditCourseModal);
	};
	const handleSaveCourseDetails = async ({ CourseName, CourseDescription, CourseCoursecategoryID }) => {
		const response = await put(`/courses/${course[0].CourseID}/course-edit`, { CourseName, CourseDescription, CourseCoursecategoryID }, {
			successMessage: 'Course Details Updated.',
			errorMessage: 'Course Failed to Update.',
		});
		if (response.isSuccess) {
			loadQuiz();
			openModal();
		}
	};
	const changeCourseStatus = async (statusID) => {
		await put(`/courses/${course[0].CourseID}/content-status`, { CoursePublicationstatusID: statusID }, {
			successMessage: 'Course Status Updated.',
			errorMessage: 'Course Status Failed to Update.',
		});
	};
	// View -------------------------------------------------------
	const renderForm = () => {
		if (showForm.type === 'Lesson') {
			return (
				<Modal>
					<LessonForm onClose={() => openForm('Lesson')} onSubmit={handleLessonSubmit} />
				</Modal>
			);
		}
		if (showForm.show && showForm.type === 'Quiz') {
			return (
				<Modal>
					<QuizForm onClose={() => openForm('Quiz')} onSubmit={handleQuizSubmit} />
				</Modal>
			);
		}
		return null;
	};
	// Content to preview
	const renderContentView = () => {
		if (selectedCourseContent.ContentType === 'Lesson') {
			return <LessonPreview lessonID={selectedCourseContent.ContentID} isCompleted = {true}/>;
		} else if (selectedCourseContent.ContentType === 'Quiz') {
			// Content creators will see the preview version of the quiz
			sessionStorage.setItem('previewQuizID', selectedCourseContent.ContentID);
			return <QuizPreview />;
		}
		return null;
	};
	if(isLoading) {
		return(
			<p>Loading content...</p>
		);
	}
	return(
		<div className="courseEditor">
			{showForm.show && renderForm()}
			<header className="courseEditorHeader">
				<div className="headerContainer">
					<ButtonTray className={'headerButtonTray'}>
						<HoverMenu label="Options">
							<a onClick = {() => changeCourseStatus(2)}><Icons.Review/>&nbsp;Send for Review</a>
							<a onClick = {() => changeCourseStatus(4)}><Icons.Publish/>&nbsp;Publish</a>
							<a onClick={openModal}><Icons.Edit/>&nbsp;Edit Course</a>
						</HoverMenu>
						<Button onClick={() => changeCourseStatus(1)} icon = {<Icons.Draft size = {28}/>} title = 'Save Course as Draft'/>
					</ButtonTray>
					<h1>{!isCourseLoading && course[0].CourseName}</h1>
				</div>
			</header>
			<div className="courseEditorBody">
				<SortableContentPanel
					title="List of Content"
					items={courseContent}
					setItems={setCourseContent}
					idField="CoursecontentID"
					isReordering={isReordering}>
					<ButtonTray>
						{
							isReordering
								?
								<>
									<Button icon={<Icons.Publish size={25} />} onClick={handleSubmitReorderedContent} title="Save changes" />
									<Button icon={<Icons.Close size={25} />} onClick={toggleReordering} title="Cancel Reordering" />
								</>
								:
								<>
									<HoverMenu label="Add">
										<a onClick={() => setShowLessonModal(true)}><Icons.Review />&nbsp;Existing Lesson</a>
										<a onClick={() => setShowQuizModal(true)}><Icons.Discard />&nbsp;Existing Quiz</a>
										<a onClick={() => openForm('Lesson')}><Icons.Publish />&nbsp;New Lesson</a>
										<a onClick={() => openForm('Quiz')}><Icons.Edit />&nbsp;New Quiz</a>
									</HoverMenu><Button icon={<Icons.Reorder size={25} />} onClick={toggleReordering} title="Reorder questions" />
								</>
						}
					</ButtonTray>
					{courseContent.map((content) => (
						<SortableContentItem
							key={content.CoursecontentID}
							id={content.CoursecontentID}
							title={`${content.ContentName}`}
							titleIcon = {content.ContentType == 'Quiz' ? <Icons.QuestionMark/> : <Icons.Notebook/>}
							onClick={() => handleItemClick(content)}
							isSelected={selectedCourseContent?.CoursecontentID === content.CoursecontentID}
							isReordering={isReordering}>
							<span className="option" onClick={handleNavigateToEditor}><Icons.Edit />Edit {content.ContentType}</span>
							<span className="option delete" onClick={handleRemoveContentFromCourse}><Icons.Delete />Remove {content.ContentType}</span>
						</SortableContentItem>
					))}
				</SortableContentPanel>
				<div className="courseEditorContent">
					<Animate.FadeIn on={selectedCourseContent?.CoursecontentID}>
						{selectedCourseContent && renderContentView()}
					</Animate.FadeIn>
				</div>
			</div>

			{showLessonModal && (
				<ContentSelectorModal
					endpoint="/lessons/mylessons"
					idField="LessonID"
					textField="LessonName"
					onClose={() => setShowLessonModal(false)}
					onSave={handleAddExistingContent}
					title='Your Lessons'
				/>
			)}

			{showQuizModal && (
				<ContentSelectorModal
					endpoint="/quizzes/myquizzes"
					idField="QuizID"
					textField="QuizName"
					onClose={() => setShowQuizModal(false)}
					onSave={handleAddExistingContent}
					title='Your Quizzes'
				/>
			)}
			{
				showEditCourseModal &&
				<Modal>
					<CourseForm
						initialValues={{ CourseName: course[0].CourseName, CourseDescription: course[0].CourseDescription, CourseCoursecategoryID: course[0].CourseCoursecategoryID }}
						onSubmit={handleSaveCourseDetails}
						onClose={openModal}
						mode={'edit'}/>
				</Modal>
			}


		</div>

	);
};

export default CourseEditor;