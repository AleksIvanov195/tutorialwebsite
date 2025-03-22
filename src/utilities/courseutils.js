import toast from 'react-hot-toast';

export const handleBookmarkCourse = async (courseID, isBookmarked, bookmarkID, authState, deleteRequest, post, loadCourses) => {
	let response;
	if (!authState.isLoggedIn) {
		toast.error('Please log in to your account before bookmarking any courses.');
	} else {
		if (isBookmarked) {
			response = await deleteRequest(`/userbookmarks/${bookmarkID}`, {
				successMessage: 'Bookmark removed.',
				errorMessage: 'Bookmark could not be removed.',
			});
		} else {
			response = await post('/userbookmarks', { UserbookmarkCourseID: courseID }, {
				successMessage: 'Course bookmarked.',
				errorMessage: 'Course could not be bookmarked.',
			});
		}
		if (response.isSuccess) {
			loadCourses();
		}
	}
};

export const handleStartCourse = async (course, authState, post, navigateToCourseView) => {
	// If user starts course for the first time make a new record.
	if (authState.isLoggedIn && course.UsercontentstatusID == 1) {
		await post('/usercourses', { UsercourseCourseID: course.CourseID }, {
			successMessage: 'Course started!',
			errorMessage: 'Course could not be started!',
		});
	} else if (!authState.isLoggedIn) {
		// If they started the course but not loggedin they cannot save progress.
		toast.error('You need to log in to save your progress!');
	}
	// Either case they are navigate to the course preview.
	navigateToCourseView(course.CourseID);
};