import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import CourseCard from '../cards/CourseCard';
import './CourseCarousel.scss';

const CourseCarousel = ({ courses, handleBookmarkCourse, handleCourseClicked }) => {
	if (courses.length === 0) return <p>No courses available.</p>;
	const settings = {
		arrows:false,
		infinite: true,
		speed: 500,
		slidesToShow: 5,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000,
		responsive: [
			{
				breakpoint: 1700,
				settings: {
					slidesToShow: 4,
					slidesToScroll: 1,
					infinite: true,
					dots: true,
				},
			},
			{
				breakpoint: 1330,
				settings: {
					slidesToShow: 3,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 1000,
				settings: {
					slidesToShow: 2,
					slidesToScroll: 1,
				},
			},
			{
				breakpoint: 600,
				settings: {
					slidesToShow: 1,
					slidesToScroll: 1,
				},
			},
		],
	};
	return (
		<Slider {...settings}>
			{courses.map(course => (
				<CourseCard
					key={course.CourseID}
					status={course.UsercontentstatusName}
					isCardBookmarked={course.IsBookmarked}
					handleBookmark={() => handleBookmarkCourse(course.CourseID, course.IsBookmarked, course.UserbookmarkID)}
					handleCardClicked={() => handleCourseClicked(course)}>
					<div className="cardContent">
						<h3>{course.CourseName}</h3>
						<p>{course.CourseDescription}</p>
						<p><strong>Category:</strong> {course.CoursecategoryName}</p>
					</div>
				</CourseCard>
			))}
		</Slider>
	);
}
export default CourseCarousel;