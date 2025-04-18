import useLoad from '../api/useLoad';
import { useState, useEffect } from 'react';
import { CardContainer } from '../components/UI/Card';
import CourseCard from '../components/enitity/cards/CourseCard';
import { ContentPanel } from '../components/UI/contentpanel/ContentPanel';
import SearchBar from '../components/UI/SearchBar';
import FilterBox from '../components/UI/FilterBox';
import useApiActions from '../hooks/useApiActions';
import { useAuth } from '../hooks/useAuth';
import useNavigation from '../hooks/useNavigation';
import Pagination from '../components/UI/Pagination';
import ContentPreviewModal from '../components/UI/modal/ContentPreviewModal';
import { handleBookmarkCourse, handleStartCourse } from '../utilities/courseutils';
import './CoursePage.scss';

export default function CoursesPage() {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	// State ------------------------------------------------------
	const { post, put, delete: deleteRequest, batchRequests } = useApiActions();
	const { navigateToCourseView } = useNavigation();
	const [showContentModal, setShowContentModal] = useState(false);
	const [selectedCourse, setSelectedCourse] = useState(null);
	const [searchString, setSearchString] = useState('');
	const [filters, setFilters] = useState({
		CoursecategoryName : [],
		UsercontentstatusName : [],
	});
	const [currentPage, setCurrentPage] = useState(1);
	// Number of items per page
	const itemsPerPage = 16;
	const generateQueryString = () => {
		const queryString = Object.entries(filters)
			.filter(([key, values]) => values.length > 0)
			.map(([key, values]) => `${key}=${values.join(',')}`)
			.join('&');
		return queryString;
	};
	// If user is loggedin use the courses/users endpoint to display content status
	const coursesEndpoint = authState.isLoggedIn
		? `/courses/users?search=${searchString}&searchFields=CourseName&${generateQueryString()}&orderby=IsBookmarked,DESC&offset=${(currentPage - 1) * itemsPerPage}&limit=${itemsPerPage}`
		: `/courses?search=${searchString}&searchFields=CourseName&${generateQueryString()}&offset=${(currentPage - 1) * itemsPerPage}&limit=${itemsPerPage}`;
	const [courses, setCourses, coursesMessage, isCoursesLoading, loadCourses, totalRecords] = useLoad(coursesEndpoint);
	// Handlers ------------------------------------------------------
	// Pagination controls
	const totalPages = Math.ceil((totalRecords || 0) / itemsPerPage);
	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= totalPages) {
			setCurrentPage(newPage);
		}
	};
	// Reset to page 1 when filters/search change
	useEffect(() => {
		setCurrentPage(1);
	}, [searchString, filters]);

	// Filter controls
	const handleFilterChange = (filterName, value) => {
		console.log(value);
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
	const handleCourseClicked = (course) =>{
		setSelectedCourse(course);
		if(course.UsercontentstatusID == 1 || !authState.isLoggedIn) {
			setShowContentModal(true);
		}else{
			const userCourseID = course.UsercourseID ? course.UsercourseID : null;
			handleStartCourse(course, authState, post, navigateToCourseView, userCourseID);
		}
	};
	const handleCloseModal = () =>{
		setShowContentModal(false);
		setSelectedCourse(null);
	};
	// View --------------------------------------------------------
	if (isCoursesLoading) {
		return <div>Loading</div>;
	}
	return (
		<div className="coursesView">

			<div className="coursesBody">
				<ContentPanel title="Search for Courses">
					<SearchBar searchString={searchString} setSearchString={setSearchString} placeholder="Search for courses..." />
					<FilterBox
						title="Filter by Course Category"
						endpoint ='/coursecategories'
						idfield = 'CoursecategoryID'
						textfield = 'CoursecategoryName'
						selectedValues={filters.CoursecategoryName}
						onChange={(value) => handleFilterChange('CoursecategoryName', value)}
						defaultCollapse = {true}
					/>
					{
						authState.isLoggedIn &&
					<FilterBox
						title="Filter by Course Status"
						endpoint ='/usercontentstatus'
						idfield = 'UsercontentstatusID'
						textfield = 'UsercontentstatusName'
						selectedValues={filters.UsercontentstatusName}
						onChange={(value) => handleFilterChange('UsercontentstatusName', value)}
					/>
					}

				</ContentPanel>
			</div>
			<div className="coursesContent">
				<CardContainer>
					{
						courses.map((course) => (
							<CourseCard
								key={course.CourseID}
								status={course.UsercontentstatusName}
								isCardBookmarked={course.IsBookmarked}
								handleBookmark={() => handleBookmarkCourse(course.CourseID, course.IsBookmarked, course.UserbookmarkID, authState, deleteRequest, post, loadCourses)}
								handleCardClicked={() => handleCourseClicked(course)}>
								<div className="cardContent">
									<h3>{course.CourseName}</h3>
									<p>{course.CourseDescription}</p>
									<p><strong>Category:</strong> {course.CoursecategoryName}</p>
								</div>
							</CourseCard>
						))
					}
				</CardContainer>
				<Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange}/>
			</div>
			{showContentModal && (
				<ContentPreviewModal
					endpoint={`/coursecontents/simplified?CoursecontentCourseID=${selectedCourse.CourseID}`}
					idField="CoursecontentID"
					textField="ContentName"
					onClose={handleCloseModal}
					onSave={() => handleStartCourse(selectedCourse, authState, post, navigateToCourseView)}
					onSaveText="Start"
					title='Review Course Contents'
				/>
			)}
		</div>
	);
};