import './Animate.scss';

const Animate = ({ children, on, type = 'fadeIn' }) => {
	return (on === undefined)
		? <div>{children}</div>
		: <div className={type} key={on}>{children}</div>;
};

Animate.FadeIn = ({ children, on }) => (
	<Animate on={on} type="fadeIn">
		{children}
	</Animate>
);
Animate.FadeIn.displayName = 'Animate.FadeIn';

Animate.SlideIn = ({ children, on }) => (
	<Animate on={on} type="slideIn">
		{children}
	</Animate>
);
Animate.SlideIn.displayName = 'Animate.SlideIn';


export default Animate;