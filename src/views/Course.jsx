import useLoad from '../api/useLoad';
import { Card, CardContainer } from '../components/UI/Card';
import { useAuth } from '../hooks/useAuth';

export default function Course() {
	// Inititalisation --------------------------------------------
	const { authState } = useAuth();
	// State ------------------------------------------------------
	const [courses, , coursesMessage, isLoading] = useLoad('/courses', authState.isLoggedIn);

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
