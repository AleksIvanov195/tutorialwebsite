import { FiRefreshCw } from 'react-icons/fi';
import { FaBold, FaItalic, FaUnderline, FaCode, FaList, FaListOl, FaPen, FaBookmark, FaRegBookmark, FaFirstdraft } from 'react-icons/fa';
import { TbBlockquote } from 'react-icons/tb';
import { FaPlus, FaRegTrashCan } from 'react-icons/fa6';
import { IoMdClose } from 'react-icons/io';
import { VscOpenPreview } from 'react-icons/vsc';
import { MdOutlinePreview, MdPublishedWithChanges } from 'react-icons/md';
import { BiImageAdd } from 'react-icons/bi';
import { PiBroomFill } from 'react-icons/pi';

const Icons = {
	Refresh: () => <FiRefreshCw size={20} color="currentColor" />,
	Bold: () => <FaBold size={20} color="currentColor" />,
	Italic: () => <FaItalic size={20} color="currentColor" />,
	Underline: () => <FaUnderline size={20} color="currentColor" />,
	Code: () => <FaCode size={20} color="currentColor" />,
	UnorderedList: () => <FaList size={20} color="currentColor" />,
	OrderedList: () => <FaListOl size={20} color="currentColor" />,
	Blockquote: () => <TbBlockquote size={20} color="currentColor" />,
	Add: () => <FaPlus size={20} color="currentColor" />,
	Close: () => <IoMdClose size={20} color="currentColor" />,
	Delete: () => <FaRegTrashCan size={20} color="currentColor" />,
	Discard: () => <PiBroomFill size={20} color="currentColor" />,
	Edit: () => <FaPen size={20} color="currentColor" />,
	Preview: () => <MdOutlinePreview size={20} color="currentColor" />,
	Publish: () => <MdPublishedWithChanges size={20} color="currentColor" />,
	Draft: () => <FaFirstdraft size={20} color="currentColor" />,
	Bookmark: () => <FaBookmark size={20} color="currentColor" />,
	RegBookmark: () => <FaRegBookmark size={20} color="currentColor" />,
	AddImage: () => <BiImageAdd size={20} color="currentColor" />,
	Review: () => <VscOpenPreview size={20} color="currentColor" />,
};

export default Icons;