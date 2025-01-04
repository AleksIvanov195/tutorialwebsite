import RenderContentViaHtml from '../components/utility/RenderContentViaHtml ';
import RenderContentWithEditor from '../components/utility/RenderContentWithEditor';
import './PreviewRichTextContent.scss';

const PreviewRichTextContent = () => {
	const contentJSON = sessionStorage.getItem('contentJSON');
	if(!contentJSON) return <div>An error occured, please try again!</div>;
	return (
		<div className="previewContainer">
			<h1>Preview</h1>
			<h1>HTML Preview</h1>
			<div className='previewHTML'>
				<RenderContentViaHtml contentJSON={JSON.parse(contentJSON)} />
			</div>
			<h1>Editor Preview</h1>
			<RenderContentWithEditor contentJSON={JSON.parse(contentJSON)} readOnly={true} />
		</div>
	);
};

export default PreviewRichTextContent;