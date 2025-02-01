import { FiRefreshCw } from 'react-icons/fi';
import { FaBold, FaItalic, FaUnderline, FaCode, FaList, FaListOl, FaPen, FaBookmark, FaRegBookmark, FaFirstdraft } from 'react-icons/fa';
import { TbBlockquote, TbReorder } from 'react-icons/tb';
import { FaPlus, FaRegTrashCan } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import { VscOpenPreview } from 'react-icons/vsc';
import { MdOutlinePreview, MdPublishedWithChanges } from 'react-icons/md';
import { BiImageAdd } from 'react-icons/bi';
import { PiBroomFill } from 'react-icons/pi';
import { GrLinkNext, GrLinkPrevious } from 'react-icons/gr';


const Icons = {
	Refresh: ({ size = 20, color = 'currentColor' }) => <FiRefreshCw size={size} color={color} />,
	Bold: ({ size = 20, color = 'currentColor' }) => <FaBold size={size} color={color} />,
	Italic: ({ size = 20, color = 'currentColor' }) => <FaItalic size={size} color={color} />,
	Underline: ({ size = 20, color = 'currentColor' }) => <FaUnderline size={size} color={color} />,
	Code: ({ size = 20, color = 'currentColor' }) => <FaCode size={size} color={color} />,
	UnorderedList: ({ size = 20, color = 'currentColor' }) => <FaList size={size} color={color} />,
	OrderedList: ({ size = 20, color = 'currentColor' }) => <FaListOl size={size} color={color} />,
	Blockquote: ({ size = 20, color = 'currentColor' }) => <TbBlockquote size={size} color={color} />,
	Add: ({ size = 20, color = 'currentColor' }) => <FaPlus size={size} color={color} />,
	Close: ({ size = 20, color = 'currentColor' }) => <IoMdClose size={size} color={color} />,
	Delete: ({ size = 20, color = 'currentColor' }) => <FaRegTrashCan size={size} color={color} />,
	Discard: ({ size = 20, color = 'currentColor' }) => <PiBroomFill size={size} color={color} />,
	Edit: ({ size = 20, color = 'currentColor' }) => <FaPen size={size} color={color} />,
	Preview: ({ size = 20, color = 'currentColor' }) => <MdOutlinePreview size={size} color={color} />,
	Publish: ({ size = 20, color = 'currentColor' }) => <MdPublishedWithChanges size={size} color={color} />,
	Draft: ({ size = 20, color = 'currentColor' }) => <FaFirstdraft size={size} color={color} />,
	Bookmark: ({ size = 20, color = 'currentColor' }) => <FaBookmark size={size} color={color} />,
	RegBookmark: ({ size = 20, color = 'currentColor' }) => <FaRegBookmark size={size} color={color} />,
	AddImage: ({ size = 20, color = 'currentColor' }) => <BiImageAdd size={size} color={color} />,
	Review: ({ size = 20, color = 'currentColor' }) => <VscOpenPreview size={size} color={color} />,
	Reorder: ({ size = 20, color = 'currentColor' }) => <TbReorder size={size} color={color} />,
	Next: ({ size = 20, color = 'currentColor' }) => <GrLinkNext size={size} color={color} />,
	Previous: ({ size = 20, color = 'currentColor' }) => <GrLinkPrevious size={size} color={color} />,
};

export default Icons;