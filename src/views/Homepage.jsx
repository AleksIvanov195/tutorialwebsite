import useLoad from '../api/useLoad';

export default function Homepage() {
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	const [courses, setCourses, coursesMessage, isLoading, loadCourses] = useLoad('/courses');
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return (
		<>
			<div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', padding: '20px' }}>
				{
					courses.map((course) => (
						<div key={course.id} style={{
							border: '1px solid #ccc',
							borderRadius: '8px',
							boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
							padding: '20px',
							backgroundColor: '#f9f9f9',
							width: '200px',
							textAlign: 'center',
						}}>
							<p style={{ fontWeight: 'bold' }}>{course.CourseName}</p>
							<p>{course.CourseDescription}</p>
						</div>
					))
				}
			</div>
		</>
	);
}