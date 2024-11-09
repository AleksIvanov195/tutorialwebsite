export default function CourseTray({ children, header }) {
	// Inititalisation --------------------------------------------
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return (
		<>
			<div className='courseTray'>
				<div className="courseTrayHeader"><h1>{header}</h1></div>
				{children}
			</div>
		</>
	);
}