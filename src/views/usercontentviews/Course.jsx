import useLoad from '../../api/useLoad';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Lesson from './Lesson';
import Quiz from './Quiz';
import Animate from '../../components/UI/Animate';
import { ContentPanel, ContentItem } from '../../components/UI/contentpanel/ContentPanel';
import { useAuth } from '../../hooks/useAuth';
import useApiActions from '../../hooks/useApiActions';
import './Course.scss';

const Course = () =>{
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	const location = useLocation();
	const { put } = useApiActions();
	const { courseID, userCourseID } = location.state || { courseID: null, userCourseID: null };
	// State ------------------------------------------------------
	const [course, setQuiz, quizMessage, isCourseLoading, loadQuiz] = useLoad(`/courses/${courseID}`);
	const [userCourse,,, isUserCourseLoading, loadUserCourse] = useLoad(`/usercourses/${userCourseID}`);
	const [courseContent, setCourseContent, , isLoading, loadCourseContent ] = useLoad(
		authState.isLoggedIn
			? `/coursecontents/simplified/user-completion?CoursecontentCourseID=${courseID}&orderby=CoursecontentOrder,ASC`
			: `/coursecontents/simplified?CoursecontentCourseID=${courseID}&orderby=CoursecontentOrder,ASC`,
	);
	const [selectedCourseContent, setSelectedCourseContent] = useState(null);
	const [isCourseCompleted, setIsCourseCompleted] = useState(false);
	// Handlers ---------------------------------------------------
	const handleItemClick = (content) => {
		setSelectedCourseContent(content);
	};
	// Check if all course content is completed
	useEffect(() => {
		if (!isUserCourseLoading && userCourse.length > 0) {
			setIsCourseCompleted(userCourse[0].UsercourseUsercontentstatusID === 3);
		}
		if (courseContent.length > 0 && userCourse.length > 0 && !isCourseCompleted) {
			const allCompleted = courseContent.every(content => content.ContentStatus == true);
			if(allCompleted && !isCourseCompleted) {
				completeCourse();
			}
		}
	}, [courseContent]);

	const completeCourse = async () => {
		if (isCourseCompleted) return;
		const response = await put(`/usercourses/${userCourse[0].UsercourseID}/complete`, {
			UsercourseUsercontentstatusID: 3,
			UserlessonCompletiondate: new Date().toISOString().replace('T', ' ').split('.')[0],
		}, {
			successMessage: 'Course has been completed!',
			errorMessage: 'Course could not be completed!',
		});
		if (response.isSuccess) {
			loadUserCourse();
		}
	};
	// View -------------------------------------------------------
	// Content to view
	const renderContentView = () => {
		if (selectedCourseContent.ContentType === 'Lesson') {
			return <Lesson lessonID={selectedCourseContent.ContentID} loadCourseContent = {loadCourseContent} isCompleted={selectedCourseContent.ContentStatus}/>;
		} else if (selectedCourseContent.ContentType === 'Quiz') {
			return <Quiz quizID={selectedCourseContent.ContentID} isCompleted={selectedCourseContent.ContentStatus} loadCourseContent = {loadCourseContent}/>;
		}
		return null;
	};
	if(isLoading || isCourseLoading || isUserCourseLoading) {
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
			<progress className="courseProgress" value={courseContent.filter(content => content.ContentStatus == true).length} max={courseContent.length}></progress>
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