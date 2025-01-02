import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import CodeBlock from '@tiptap/extension-code-block';
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
				<Button onClick={addImage}>
				Add Image
				</Button>
			)}
		</div>
	);

};

const RichTextEditor = ({ initialContent, options }) => {
	// Inititalisation --------------------------------------------
	const editor = useEditor({
		extensions: [
			StarterKit,
			Bold,
			Italic,
			Underline,
			CodeBlock.configure({
				HTMLAttributes: {
					class: 'codeBlock',
				},
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
		<div>
			<OptionsBar editor={editor} options={options} />
			<EditorContent editor={editor} />
			<Button onClick={onSave}>Save</Button>
			<div dangerouslySetInnerHTML={{ __html: content }} />
		</div>
	);
};

export default RichTextEditor;