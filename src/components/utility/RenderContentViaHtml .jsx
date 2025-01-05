import { generateHTML } from '@tiptap/core';
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
import TextStyle from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';

const RenderContentViaHtml = ({ contentJSON }) => {
	// Inititalisation --------------------------------------------
	const extensions = [
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
		TextStyle,
		FontFamily,
	];
	const htmlContent = generateHTML(contentJSON, extensions);
	// State ------------------------------------------------------
	// Handlers ---------------------------------------------------
	// View -------------------------------------------------------
	return (
		<div dangerouslySetInnerHTML={{ __html: htmlContent }} />
	);

};

export default RenderContentViaHtml ;