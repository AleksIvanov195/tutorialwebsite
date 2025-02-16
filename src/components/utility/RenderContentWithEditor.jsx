import StarterKit from '@tiptap/starter-kit';
import { useEditor, EditorContent } from '@tiptap/react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Highlight from '@tiptap/extension-highlight';
import ImageResize from 'tiptap-extension-resize-image';
import TextStyle from '@tiptap/extension-text-style';
import { FontFamily } from '@tiptap/extension-font-family';

const RenderContentWithEditor = ({ contentJSON }) => {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({ codeBlock: false }),
			Underline,
			CodeBlockLowlight.configure({
				lowlight: createLowlight(common),
			}),
			Link,
			Highlight,
			ImageResize,
			TextStyle,
			FontFamily,
		],
		content: contentJSON,
		editable: false,
	});

	if (!editor) {
		return <p>Loading...</p>;
	}

	return <EditorContent editor={editor} />;
};

export default RenderContentWithEditor;