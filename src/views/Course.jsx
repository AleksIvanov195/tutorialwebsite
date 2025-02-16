import useLoad from '../api/useLoad';
import { Card, CardContainer } from '../components/UI/Card';

export default function Course() {
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	const [courses, , coursesMessage, isLoading] = useLoad('/courses');

	// View
	return (
		<>
			<CardContainer>
				{isLoading && <div>Loading...</div>}

				{!isLoading && courses.length === 0 && <div>{coursesMessage}</div>}

				{!isLoading && courses.length > 0 && (
					courses.map((course) => (
						<Card key={course.CourseID}>
							<p style={{ fontWeight: 'bold' }}>{course.CourseName}</p>
							<p>{course.CourseDescription}</p>
						</Card>
					))
				)}
			</CardContainer>
		</>
	);
};
