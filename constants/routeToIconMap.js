import { HiDocumentText } from 'react-icons/hi';
import { FaTasks } from 'react-icons/fa';
import { MdForum, MdPeopleAlt } from 'react-icons/md';
import { RiDashboardFill } from 'react-icons/ri';

const iconProps = {
	fontSize: '1.1rem',
	className: 'text-secondary-contrast',
};

export const routeToIconMap = {
	'/forums': <MdForum {...iconProps} />,
	'/docs': <HiDocumentText {...iconProps} />,
	'/tasks': <FaTasks {...iconProps} />,
	'/HR': <MdPeopleAlt {...iconProps} />,
	'/dashboard': <RiDashboardFill {...iconProps} />,
};
