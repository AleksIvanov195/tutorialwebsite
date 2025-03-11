import useApiActions from '../../hooks/useApiActions';
import useLoad from '../../api/useLoad';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Lesson from './Lesson';
import Quiz from './Quiz';
import Animate from '../../components/UI/Animate';
import { ContentPanel, ContentItem } from '../../components/UI/contentpanel/ContentPanel';

import './Course.scss';
const Course = () =>{
	// Inititalisation --------------------------------------------
	const { post, put, delete: deleteRequest, batchRequests } = useApiActions();
	const location = useLocation();
	const { courseID } = location.state || { courseID: null };
	// State ------------------------------------------------------
	const [course, setQuiz, quizMessage, isCourseLoading, loadQuiz] = useLoad(`/courses/${courseID}`);
	const [courseContent, setCourseContent, , isLoading, loadCourseContent ] = useLoad(`/coursecontents/simplified/user-completion?CoursecontentCourseID=${courseID}&orderby=CoursecontentOrder,ASC`);
	const [selectedCourseContent, setSelectedCourseContent] = useState(null);
	// Handlers ---------------------------------------------------
	const handleItemClick = (content) => {
		setSelectedCourseContent(content);
	};
	// View -------------------------------------------------------
	// Content to view
	const renderContentView = () => {
		if (selectedCourseContent.ContentType === 'Lesson') {
			return <Lesson lessonID={selectedCourseContent.ContentID} />;
		} else if (selectedCourseContent.ContentType === 'Quiz') {
			return <Quiz quizID={selectedCourseContent.ContentID} />;
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
							enableOptions = {false}
							completed={content.ContentStatus}/>
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

export default Course;