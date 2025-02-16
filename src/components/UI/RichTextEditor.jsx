import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import ImageResize from 'tiptap-extension-resize-image';
import TextStyle from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from './Buttons';
import js from 'highlight.js/lib/languages/javascript';
import Icons from './Icons';
import HoverMenu from './HoverMenu';
import Select from './Select';
import './RichTextEditor.scss';

const OptionsBar = ({ onEditDetails, editor, options, onSaveDraft, onPreview, onSaveReview, onDiscard, onSavePublish }) => {
	// Inititalisation --------------------------------------------
	if (!editor) {
		return null;
	}
	// State ------------------------------------------------------

	// Handlers ---------------------------------------------------
	const addImage = () => {
		const url = prompt('Enter the URL of the image:');
		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	};

	const handleHeadingChange = (event) => {
		const level = parseInt(event.target.value);
		editor.chain().focus().toggleHeading({ level }).run();
	};

	const handleFontChange = (event) => {
		const fontStyle = event.target.value;
		editor.chain().focus().setFontFamily(fontStyle).run();
	};

	// View -------------------------------------------------------
	const currentHeading =
	editor.isActive('heading', { level: 1 }) ? '1' :
		editor.isActive('heading', { level: 2 }) ? '2' :
			editor.isActive('heading', { level: 3 }) ? '3' :
				editor.isActive('heading', { level: 4 }) ? '4' :
					editor.isActive('heading', { level: 5 }) ? '5' :
						editor.isActive('heading', { level: 6 }) ? '6' : '';

	const currentFont = editor.isActive('textStyle', { fontFamily: 'Arial' }) ? 'Arial' :
		editor.isActive('textStyle', { fontFamily: 'Helvetica' }) ? 'Helvetica' :
			editor.isActive('textStyle', { fontFamily: 'Tahoma' }) ? 'Tahoma' :
				editor.isActive('textStyle', { fontFamily: 'Roboto' }) ? 'Roboto' :
					editor.isActive('textStyle', { fontFamily: 'Serif' }) ? 'Serif' :
						editor.isActive('textStyle', { fontFamily: 'Monospace' }) ? 'Monospace' : 'Arial';
	const headingOptions = [
		{ value: '', label: 'Select Heading' },
		{ value: '1', label: 'Heading 1' },
		{ value: '2', label: 'Heading 2' },
		{ value: '3', label: 'Heading 3' },
		{ value: '4', label: 'Heading 4' },
		{ value: '5', label: 'Heading 5' },
		{ value: '6', label: 'Heading 6' },
	];

	const fontOptions = [
		{ value: 'Arial', label: 'Arial' },
		{ value: 'Helvetica', label: 'Helvetica' },
		{ value: 'Tahoma', label: 'Tahoma' },
		{ value: 'Roboto', label: 'Roboto' },
		{ value: 'Serif', label: 'Serif' },
		{ value: 'Monospace', label: 'Monospace' },
	];
	return (
		<div className='optionsBar'>
			<HoverMenu label = 'Options'>
				<a onClick={onSaveDraft}><Icons.Draft/> &nbsp; Save as Draft</a>
				<a onClick={onSaveReview}><Icons.Review/>&nbsp;Send for Review</a>
				<a onClick={onSavePublish}><Icons.Publish/>&nbsp;Publish</a>
				<a onClick={onEditDetails}><Icons.Edit/>&nbsp;Edit Details</a>
			</HoverMenu>
			<Button className={'optionsBarButton'} onClick={onPreview} icon ={<Icons.Preview size = {25}/>} title = 'Preview Text'/>
			<Button
				icon = {<Icons.Discard/>}
				onClick={onDiscard}
				className={'optionsBarButton'}
				title='Clear editor, CTRL + Z to revert'
			/>
			{options.bold && (
				<Button
					icon = {<Icons.Bold/>}
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={`optionsBarButton ${editor.isActive('bold') ? 'isActive' : ''}`}
					title='Make your text Bold, CTRL + B'
				/>
			)}
			{options.italic && (
				<Button
					icon = {<Icons.Italic/>}
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={`optionsBarButton ${editor.isActive('italic') ? 'isActive' : ''}`}
					title='Italicize your text, CTRL + I'
				/>
			)}
			{options.underline && (
				<Button
					icon = {<Icons.Underline/>}
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					className={`optionsBarButton ${editor.isActive('underline') ? 'isActive' : ''}`}
					title='Underline your text, CTRL + U'
				/>
			)}
			{options.codeBlock && (
				<Button
				  icon = {<Icons.Code/>}
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					className={`optionsBarButton ${editor.isActive('codeBlock') ? 'isActive' : ''}`}
					title='Codeblock, CTRL + Alt + C'
				/>
			)}
			{options.bulletList && (
				<Button
					icon = {<Icons.UnorderedList/>}
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={`optionsBarButton ${editor.isActive('bulletList') ? 'isActive' : ''}`}
					title='Bullets, CTRL + Shift + 8'
				/>
			)}
			{options.orderedList && (
				<Button
					icon = {<Icons.OrderedList/>}
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={`optionsBarButton ${editor.isActive('orderedList') ? 'isActive' : ''}`}
					title='Ordered list, CTRL + Shift + 7'
				/>
			)}
			{options.blockquote && (
				<Button
					icon = {<Icons.Blockquote/>}
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className={`optionsBarButton ${editor.isActive('blockquote') ? 'isActive' : ''}`}
					title='Blockquote, CTRL + Shift + B'
				/>
			)}
			{options.image && (
				<Button
				 icon = {<Icons.AddImage/>}
				 onClick={addImage}
				 className={'optionsBarButton'}
				 title='Insert an image'
				 />
			)}
			{options.heading && (
				<Select
					value={currentHeading}
					onChange={handleHeadingChange}
					options={headingOptions}
					className="optionsBarDropdown"
				/>
			)}
			{options.fontStyle && (
				<Select
					value={currentFont}
					onChange={handleFontChange}
					options={fontOptions}
					className="optionsBarDropdown"
				/>
			)}
		</div>
	);
};

const RichTextEditor = ({ handleEditContentDetails, initialContent, options, handleSave }) => {
	// Inititalisation --------------------------------------------
	const lowlight = createLowlight(common);
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				codeBlock: false,
			}),
			Underline,
			CodeBlockLowlight.configure({
				lowlight,
			}),
			Link,
			Highlight,
			ImageResize,
			TextStyle,
			FontFamily,
			Placeholder.configure({
				placeholder: 'Start writing your content here...',
				showOnlyWhenEditable: true,
			}),
		],
		content: initialContent || '',
	});
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	const onSaveDraft = () =>{
		handleSave(JSON.stringify(editor.getJSON()), 1);
	};
	const onSavePublish = () =>{
		handleSave(JSON.stringify(editor.getJSON()), 4);
	};
	const onSaveReview = () =>{
		handleSave(JSON.stringify(editor.getJSON()), 2);
	};
	const onPreview = () => {
		const contentJSON = JSON.stringify(editor.getJSON());
		sessionStorage.setItem('contentJSON', contentJSON);
		window.open('/preview', '_blank');
	};
	const onDiscard = () =>{
		const confirmDiscard = window.confirm('Are you sure you want to discard all content?');
		if (confirmDiscard) {
			editor.commands.clearContent();
		}
	};
	// View -------------------------------------------------------
	return (
		<>
			<div className = 'editorContainer'>
				<OptionsBar
					editor={editor}
					options={options}
					onSaveDraft={onSaveDraft}
					onPreview={onPreview}
					onSaveReview={onSaveReview}
					onDiscard={onDiscard}
					onSavePublish={onSavePublish}
					onEditDetails={handleEditContentDetails}
				/>
				<div className='editorContent'>
					<EditorContent editor={editor} />
				</div>
			</div>

		</>

	);
};

export default RichTextEditor;