import './Footer.scss';

export default function Footer() {
	return (
		<footer className="footer">
			<p>
    &copy; {new Date().getFullYear()} Alecodex · Developed by&nbsp;
				<a href="https://github.com/AleksIvanov195" target="_blank">Aleksandar Ivanov</a>
			</p>
			<div className="footerLinks">
				<a href="/help">Help</a>
				<a href="https://github.com/AleksIvanov195/tutorialwebsite" target="_blank" >Changelog</a>
				<a href="https://github.com/AleksIvanov195/tutorialwebsite" target="_blank" >Docs</a>
				<a href="/feedback">Send Feedback</a>
			</div>
		</footer>

	);
}
