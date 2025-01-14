import RenderContentWithEditor from '../components/utility/RenderContentWithEditor';
import './PreviewRichTextContent.scss';

const PreviewRichTextContent = () => {
	const contentJSON = sessionStorage.getItem('contentJSON');
	if(!contentJSON) return <div>An error occured, please try again!</div>;
	return (
		<div className="previewContainer">
			<h1>Preview</h1>
			<div className = "previewContent">
				<RenderContentWithEditor contentJSON={JSON.parse(contentJSON)} readOnly={true} />
			</div>
		</div>
	);
};

export default PreviewRichTextContent;