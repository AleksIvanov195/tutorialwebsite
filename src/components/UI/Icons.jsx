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
	Refresh: ({ size = 20 }) => <FiRefreshCw size={size} color="currentColor" />,
	Bold: ({ size = 20 }) => <FaBold size={size} color="currentColor" />,
	Italic: ({ size = 20 }) => <FaItalic size={size} color="currentColor" />,
	Underline: ({ size = 20 }) => <FaUnderline size={size} color="currentColor" />,
	Code: ({ size = 20 }) => <FaCode size={size} color="currentColor" />,
	UnorderedList: ({ size = 20 }) => <FaList size={size} color="currentColor" />,
	OrderedList: ({ size = 20 }) => <FaListOl size={size} color="currentColor" />,
	Blockquote: ({ size = 20 }) => <TbBlockquote size={size} color="currentColor" />,
	Add: ({ size = 20 }) => <FaPlus size={size} color="currentColor" />,
	Close: ({ size = 20 }) => <IoMdClose size={size} color="currentColor" />,
	Delete: ({ size = 20 }) => <FaRegTrashCan size={size} color="currentColor" />,
	Discard: ({ size = 20 }) => <PiBroomFill size={size} color="currentColor" />,
	Edit: ({ size = 20 }) => <FaPen size={size} color="currentColor" />,
	Preview: ({ size = 20 }) => <MdOutlinePreview size={size} color="currentColor" />,
	Publish: ({ size = 20 }) => <MdPublishedWithChanges size={size} color="currentColor" />,
	Draft: ({ size = 20 }) => <FaFirstdraft size={size} color="currentColor" />,
	Bookmark: ({ size = 20 }) => <FaBookmark size={size} color="currentColor" />,
	RegBookmark: ({ size = 20 }) => <FaRegBookmark size={size} color="currentColor" />,
	AddImage: ({ size = 20 }) => <BiImageAdd size={size} color="currentColor" />,
	Review: ({ size = 20 }) => <VscOpenPreview size={size} color="currentColor" />,
	Reorder: ({ size = 20 }) => <TbReorder size={size} color="currentColor" />,
	Next: ({ size = 20 }) => <GrLinkNext size={size} color="currentColor" />,
	Previous: ({ size = 20 }) => <GrLinkPrevious size={size} color="currentColor" />,
};

export default Icons;