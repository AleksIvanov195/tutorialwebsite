import Form from '../../UI/formui/Form';
const LessonForm = ({ onSubmit, onClose, initialValues = {}, mode = 'create' }) =>{
	// Inititalisation --------------------------------------------
	const fields = [
		{
			name: 'LessonName',
			label: 'Lesson Name',
			type: 'text',
			placeholder: 'Enter lesson name...',
			validation: {
				required: 'Lesson Name is required',
				minLength: { value: 3, message: 'Must be at least 3 characters long' },
			},
		},
		{
			name: 'LessonDescription',
			label: 'Lesson Description',
			type: 'textarea',
			placeholder: 'Enter lesson description',
			validation: {
				required: 'Lesson Description is required',
				minLength: { value: 10, message: 'Must be at least 10 characters long' },
			},
		},
	];
	const defaultContent = { 'type':'doc', 'content':[{ 'type':'paragraph', 'content':[{ 'type':'text', 'marks':[{ 'type':'textStyle', 'attrs':{ 'fontFamily':'Arial' } }], 'text':'' }] }] };
	const defaultValues = {
		LessonName: '',
		LessonDescription: '',
		LessonContentJSON: JSON.stringify(defaultContent),
		LessonPublicationstatusID: '1',
	};
	const initialFormValues = mode === 'edit' ? initialValues : defaultValues;
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------

	// View -------------------------------------------------------
	const header = mode === 'edit' ? 'Edit Lesson' : 'Create Lesson';
	return <Form fields={fields} defaultValues={initialFormValues} onClose = {onClose} onSubmit={onSubmit} header={header}/>;
};
export default LessonForm;