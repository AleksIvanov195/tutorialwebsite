import useLoad from '../api/useLoad';
import { useState } from 'react';
import { Card, CardContainer } from '../components/UI/Card';
import { ContentPanel, ContentItem } from '../components/UI/contentpanel/ContentPanel';
import SearchBar from '../components/UI/SearchBar';
import FilterBox from '../components/UI/FilterBox';
import './Course.scss';

export default function Course() {
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
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
	const [courses, , coursesMessage, isCoursesLoading] = useLoad(`/courses/users?search=${searchString}&searchFields=CourseName&${generateQueryString()}`);
	const [categories, setCategories, ,isCategoriesLoading] = useLoad('/coursecategories');

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
							<Card key={course.CourseID}>
								<p style={{ fontWeight: 'bold' }}>{course.CourseName}</p>
								<p>{course.CourseDescription}</p>
								<p><strong>Category:</strong> {course.CoursecategoryName}</p>
							</Card>
						))
					}
				</CardContainer>
			</div>
		</div>
	);
};