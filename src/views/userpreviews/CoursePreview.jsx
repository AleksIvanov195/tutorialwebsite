import useApiActions from '../../hooks/useApiActions';
import useLoad from '../../api/useLoad';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import LessonPreview from '../userpreviews/LessonPreview';
import QuizUserView from '../userpreviews/QuizUserView';
import Animate from '../../components/UI/Animate';
import { ContentPanel, ContentItem } from '../../components/UI/contentpanel/ContentPanel';
import './CoursePreview.scss';
const CoursePreview = () =>{
	// Inititalisation --------------------------------------------
	const { post, put, delete: deleteRequest, batchRequests } = useApiActions();
	const location = useLocation();
	const { courseID } = location.state || { courseID: null };
	// State ------------------------------------------------------
	const [course, setQuiz, quizMessage, isCourseLoading, loadQuiz] = useLoad(`/courses/${courseID}`);
	const [courseContent, setCourseContent, , isLoading, loadCourseContent ] = useLoad(`/coursecontents/simplified?CoursecontentCourseID=${courseID}&orderby=CoursecontentOrder,ASC`);
	const [selectedCourseContent, setSelectedCourseContent] = useState(null);
	// Handlers ---------------------------------------------------
	const handleItemClick = (content) => {
		setSelectedCourseContent(content);
	};
	// View -------------------------------------------------------
	// Content to preview
	const renderContentView = () => {
		if (selectedCourseContent.ContentType === 'Lesson') {
			return <LessonPreview lessonID={selectedCourseContent.ContentID} />;
		} else if (selectedCourseContent.ContentType === 'Quiz') {
			return <QuizUserView quizID={selectedCourseContent.ContentID} />;
		}
		return null;
	};
	if(isLoading) {
		return(
			<p>Loading content...</p>
		);
	}
	return(
		<div className="coursePreview">
			<header className="coursePreviewHeader">
				<div className="headerContainer">
					<h1>{!isCourseLoading && course[0].CourseName}</h1>
				</div>
			</header>
			<div className="coursePreviewBody">
				<ContentPanel title="List of Content">
					{courseContent.map((content) => (
						<ContentItem
							key={content.CoursecontentID}
							title={`${content.ContentType}: ${content.ContentName}`}
							onClick={() => handleItemClick(content)}
							isSelected={selectedCourseContent?.CoursecontentID === content.CoursecontentID}
							enableOptions = {false}>
						</ContentItem>
					))}
				</ContentPanel>
				<div className="coursePreviewContent">
					<Animate.FadeIn on={selectedCourseContent?.CoursecontentID}>
						{selectedCourseContent && renderContentView()}
					</Animate.FadeIn>
				</div>
			</div>

		</div>

	);
};

export default CoursePreview;