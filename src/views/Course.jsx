import useLoad from '../api/useLoad';
import { Card, CardContainer } from '../components/UI/Card';

export default function Course() {
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	const [courses, setCourses, coursesMessage, isLoading, loadCourses] = useLoad('/courses');
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return (
		<>
			<CardContainer>
				{
					courses.map((course) => (
						<Card key={course.id}>
							<p style={{ fontWeight: 'bold' }}>{course.CourseName}</p>
							<p>{course.CourseDescription}</p>
						</Card>
					))
				}
			</CardContainer>
		</>
	);
}