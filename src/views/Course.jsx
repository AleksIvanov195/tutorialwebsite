import useLoad from '../api/useLoad';
import { useState } from 'react';
import { Card, CardContainer } from '../components/UI/Card';
import { ContentPanel } from '../components/UI/contentpanel/ContentPanel';
import SearchBar from '../components/UI/SearchBar';
import FilterBox from '../components/UI/FilterBox';
import useApiActions from '../hooks/useApiActions';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import './Course.scss';

export default function Course() {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	// State ------------------------------------------------------
	const { post, put, delete: deleteRequest, batchRequests } = useApiActions();
	const [searchString, setSearchString] = useState('');
	const [filters, setFilters] = useState({
		CoursecategoryName : [],
	});
	const generateQueryString = () => {
		const queryString = Object.entries(filters)
			.filter(([key, values]) => values.length > 0)
			.map(([key, values]) => `${key}=${values.join(',')}`)
			.join('&');
		return queryString;
	};
	const coursesEndpoint = authState.isLoggedIn
		? `/courses/users?search=${searchString}&searchFields=CourseName&${generateQueryString()}`
		: `/courses?search=${searchString}&searchFields=CourseName&${generateQueryString()}`
	const [courses, setCourses, coursesMessage, isCoursesLoading, loadCourses] = useLoad(coursesEndpoint);
	const [categories, setCategories, , isCategoriesLoading] = useLoad('/coursecategories');

	// Handlers ------------------------------------------------------
	const handleFilterChange = (filterName, value) => {
		setFilters((prevFilters) => {
			const updatedFilters = { ...prevFilters };
			if (updatedFilters[filterName].includes(value)) {
				// Remove value if already selected
				updatedFilters[filterName] = updatedFilters[filterName].filter((item) => item !== value);
			} else {
				// Add value if not selected
				updatedFilters[filterName] = [...updatedFilters[filterName], value];
			}
			return updatedFilters;
		});
	};
	const handleBookmarkCourse = async (courseID, isBookmarked, bookmarkID) => {
		let response;
		if(!authState.isLoggedIn) {
			toast.error('Please log in to your account before bookmarking any courses.');
		}else{
			if(isBookmarked) {
				response = await deleteRequest(`/userbookmarks/${bookmarkID}`, {
					successMessage: 'Bookmark removed.',
					errorMessage: 'Bookmark could not be removed.',
				});
			}else{
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

	// View --------------------------------------------------------
	if (isCoursesLoading || isCategoriesLoading) {
		return <div>Loading</div>;
	}
	return (
		<div className="coursesView">
			<div className="coursesBody">
				<ContentPanel title="Search for Courses">
					<SearchBar searchString={searchString} setSearchString={setSearchString} placeholder="Search for courses..." />
					<FilterBox title="Filter by Course Category" options ={categories} selectedValues={filters.CoursecategoryName} onChange={(value) => handleFilterChange('CoursecategoryName', value)}/>
				</ContentPanel>
			</div>
			<div className="coursesContent">
				<CardContainer>
					{
						courses.map((course) => (
							<Card
								key={course.CourseID}
								status={course.UsercontentstatusName}
								isCardBookmarked={course.IsBookmarked}
								handleBookmark={() => handleBookmarkCourse(course.CourseID, course.IsBookmarked, course.UserbookmarkID)}
							>
								<div className="cardContent">
									<h3>{course.CourseName}</h3>
									<p>{course.CourseDescription}</p>
									<p><strong>Category:</strong> {course.CoursecategoryName}</p>
								</div>
							</Card>
						))
					}
				</CardContainer>
			</div>
		</div>
	);
};