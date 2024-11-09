import { useForm } from 'react-hook-form';

export default function CourseForm({ onSubmit }) {
	const { register, handleSubmit, formState: { errors } } = useForm({
		defaultValues: { CourseName: '', CourseDescription: '', CourseCategory: '', CourseCoursepublicationstatusID: 1 },
	});
	return (
		<form className="form" onSubmit={handleSubmit(onSubmit)}>
			<div>
				<label>Course Name</label>
				<input
					{...register('CourseName', { required: 'Course Name is required' })}
					placeholder="Enter course name"
				/>
				{errors.CourseName && <p>{errors.CourseName.message}</p>}
			</div>

			<div>
				<label>Course Description</label>
				<textarea
					{...register('CourseDescription', { required: 'Course Description is required' })}
					placeholder="Enter course description"
				/>
				{errors.CourseDescription && <p>{errors.CourseDescription.message}</p>}
			</div>

			<div>
				<label>Course Category</label>
				<input
					{...register('CourseCategory')}
					placeholder="Enter course Category"
				/>
				{errors.CourseDescription && <p>{errors.CourseDescription.message}</p>}
			</div>

			<div>
				<label>CourseCoursepublicationstatusID</label>
				<input
					{...register('CourseCoursepublicationstatusID')}
					placeholder="Enter course CourseCoursepublicationstatusID"
				/>
				{errors.CourseDescription && <p>{errors.CourseDescription.message}</p>}
			</div>

			<button type="submit">Save Course</button>
		</form>
	);
}
