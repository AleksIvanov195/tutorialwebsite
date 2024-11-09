import useLoad from '../api/useLoad';
import { Card, CardContainer } from '../components/UI/Card';
import { useAuth } from '../hooks/useAuth';

export default function Course() {
	// Inititalisation --------------------------------------------
	const { loggedInUser, loading } = useAuth();
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