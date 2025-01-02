import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import Image from '@tiptap/extension-image';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import ListItem from '@tiptap/extension-list-item';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import Blockquote from '@tiptap/extension-blockquote';
import Highlight from '@tiptap/extension-highlight';
import Dropcursor from '@tiptap/extension-dropcursor';
import ImageResize from 'tiptap-extension-resize-image';
import Heading from '@tiptap/extension-heading';
import Button from './Buttons';
import './RichTextEditor.scss';

const OptionsBar = ({ editor, options }) =>{
	// Inititalisation --------------------------------------------
	if (!editor) {
		return null;
	}
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	const addImage = () =>{
		const url = prompt('Enter the URL of the image:');
		if (url) {
			editor.chain().focus().setImage({ src: url }).run();
		}
	};
	const setHeading = (event) => {
		const level = parseInt(event.target.value);
		editor.chain().focus().toggleHeading({ level }).run();
	};
	// View -------------------------------------------------------
	return (
		<div className='optionsBar '>
			{options.bold && (
				<Button
					onClick={() => editor.chain().focus().toggleBold().run()}
					className={`optionsBarButton ${editor.isActive('bold') ? 'isActive' : ''}`}
				>
				Bold
				</Button>
			)}
			{options.italic && (
				<Button
					onClick={() => editor.chain().focus().toggleItalic().run()}
					className={`optionsBarButton ${editor.isActive('italic') ? 'isActive' : ''}`}
				>
				Italic
				</Button>
			)}
			{options.underline && (
				<Button
					onClick={() => editor.chain().focus().toggleUnderline().run()}
					className={`optionsBarButton ${editor.isActive('underline') ? 'isActive' : ''}`}
				>
				Underline
				</Button>
			)}
			{options.codeBlock && (
				<Button
					onClick={() => editor.chain().focus().toggleCodeBlock().run()}
					className={`optionsBarButton ${editor.isActive('codeBlock') ? 'isActive' : ''}`}
				>
				Code Block
				</Button>
			)}
			{options.bulletList && (
				<Button
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					className={`optionsBarButton ${editor.isActive('bulletList') ? 'isActive' : ''}`}
				>
				Bullet List
				</Button>
			)}
			{options.orderedList && (
				<Button
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					className={`optionsBarButton ${editor.isActive('orderedList') ? 'isActive' : ''}`}
				>
					Ordered List
				</Button>
			)}
			{options.blockquote && (
				<Button
					onClick={() => editor.chain().focus().toggleBlockquote().run()}
					className={`optionsBarButton ${editor.isActive('blockquote') ? 'isActive' : ''}`}
				>
				Blockquote
				</Button>
			)}
			{options.image && (
				<Button onClick={addImage } className={'optionsBarButton'}>
				Add Image
				</Button>
			)}
			{options.heading && (
				<select onChange={setHeading} className="optionsBarDropdown">
					<option value="">Select Heading</option>
					<option value="1">Heading 1</option>
					<option value="2">Heading 2</option>
					<option value="3">Heading 3</option>
					<option value="4">Heading 4</option>
					<option value="5">Heading 5</option>
					<option value="6">Heading 6</option>
				</select>
			)}
		</div>
	);

};

const RichTextEditor = ({ initialContent, options }) => {
	// Inititalisation --------------------------------------------
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				codeBlock: false,
			}),
			Bold,
			Italic,
			Underline,
			CodeBlockLowlight.configure({
				lowlight: createLowlight(common),
			}),
			Image,
			Link,
			ListItem,
			BulletList,
			OrderedList,
			Blockquote,
			Highlight,
			Dropcursor,
			ImageResize,
			Heading,
		],
		content: initialContent || '<p>Start writing your lesson here...</p>',
	});
	// State ------------------------------------------------------
	const [content, setContent] = useState('');
	// Handlers ---------------------------------------------------
	const onSave = () =>{
		console.log(editor.getHTML());
		setContent(editor.getHTML());
	};
	// View -------------------------------------------------------
	return (
		<>
			<div className = 'editorContainer'>
				<OptionsBar editor={editor} options={options} />
				<div className='editorContent'>
					<EditorContent editor={editor} />
				</div>
				<Button onClick={onSave}>Save Draft</Button>
				<Button>Preview</Button>
				<Button>Send For Review</Button>
				<Button>Discard</Button>
				<Button>Publish</Button>
				<div className = 'preview' dangerouslySetInnerHTML={{ __html: content }} />
			</div>

		</>

	);
};

export default RichTextEditor;