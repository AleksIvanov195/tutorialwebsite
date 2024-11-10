import { useForm } from 'react-hook-form';
import React from 'react';
import './CourseForm.scss';
export default function CourseForm({ onSubmit }) {
	// Inititalisation --------------------------------------------
	const categories = [
		{ value: '', label: 'Select a category' },
		{ value: 'Web Development', label: 'Web Development' },
		{ value: 'Backend Development', label: 'Backend Development' },
		{ value: 'Programming', label: 'Programming' },
		{ value: 'Web Design', label: 'Web Design' },
	];
	// State ------------------------------------------------------
	const { register, handleSubmit, formState, formState: { errors, isSubmitSuccessful }, reset } = useForm({
		defaultValues: { CourseName: '', CourseDescription: '', CourseCategory: '', CourseCoursepublicationstatusID: 1 },
	});
	React.useEffect(() => {
		if (formState.isSubmitSuccessful) {
			reset({ CourseName: '', CourseDescription: '', CourseCategory: '', CourseCoursepublicationstatusID: 1 });
		}
	}, [formState, reset]);
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------

	return (
		<form className="courseForm" onSubmit={handleSubmit(onSubmit)}>
			<div className='formItem'>
				<label>Course Name</label>
				<input
					{...register('CourseName', {
						required: 'Course Name is required',
						minLength: {
							value: 3,
							message: 'Course Name must be at least 3 characters long',
						},
					})}
					placeholder="Enter course name"
				/>
				{errors.CourseName && <p className='errorMessage'>{errors.CourseName.message}</p>}
			</div>

			<div className='formItem'>
				<label>Course Description</label>
				<textarea
					{...register('CourseDescription', {
						required: 'Course Description is required',
						minLength: {
							value: 10,
							message: 'Course Description must be at least 10 characters long',
						},
					})}
					placeholder="Enter course description"
				/>
				{errors.CourseDescription && <p className='errorMessage'>{errors.CourseDescription.message}</p>}
			</div>

			<div className='formItem'>
				<label>Course Category</label>
				<select
					{...register('CourseCategory', { required: 'Course Category is required' })}
				>
					{categories.map((category) => (
						<option key={category.value} value={category.value}>
							{category.label}
						</option>
					))}
				</select>
				{errors.CourseCategory && <p className='errorMessage'>{errors.CourseCategory.message}</p>}
			</div>

			<div className='formItem'>
				<label>CourseCoursepublicationstatusID</label>
				<input
					{...register('CourseCoursepublicationstatusID')}
					placeholder="Enter course CourseCoursepublicationstatusID"
				/>
				{errors.CourseCoursepublicationstatusID && <p className='errorMessage'>{errors.CourseCoursepublicationstatusID.message}</p>}
			</div>

			<button className='submitCourseButton' type="submit">Save Course</button>
		</form>
	);
}
