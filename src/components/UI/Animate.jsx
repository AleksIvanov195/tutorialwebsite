import './Animate.scss';

const Animate = ({ children, on, type = 'fadeIn' }) => {
	return on === undefined ? (
		<div>{children}</div>
	) : (
		<div className={type} key={on?.toString()}>
			{children}
		</div>
	);
};

const FadeIn = ({ children, on }) => (
	<Animate on={on} type="fadeIn">
		{children}
	</Animate>
);

const SlideIn = ({ children, on }) => (
	<Animate on={on} type="slideIn">
		{children}
	</Animate>
);

Animate.FadeIn = FadeIn;
Animate.SlideIn = SlideIn;

export default Animate;