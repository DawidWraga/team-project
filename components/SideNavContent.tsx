import { SignOutBtn } from 'components/SignOutBtn';
import Avatar from 'components/Avatar';
import pages from 'db/pages.json';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { getCurrentUser } from 'controllers/auth';
import { MdForum, MdPeopleAlt } from 'react-icons/md';
import { HiDocumentText } from 'react-icons/hi';
import { FaTasks } from 'react-icons/fa';

interface IProps {}

const iconProps = {
	fontSize: '1.2rem',
	className: 'text-secondary-contrast',
};

const routeToIconMap = {
	'/forums': <MdForum {...iconProps} />,
	'/docs': <HiDocumentText {...iconProps} />,
	'/tasks': <FaTasks {...iconProps} />,
	'/HR': <MdPeopleAlt {...iconProps} />,
};

export default function SideNavContent(props: IProps) {
	const router = useRouter();
	const user = getCurrentUser();

	return (
		<div className="flex flex-col relative h-full ">
			<header
				className=" hover:cursor-pointer h-[52px] flex items-center justify-center text-secondary-contrast"
				onClick={() => router.push('/')}
			>
				logo + title
			</header>
			<nav className="grow">
				{pages.pages.map(({ label, route }) => {
					return (
						<div
							key={route}
							className={`w-full px-2 gap-2 flex justify-start items-center hover:cursor-pointer hover:bg-secondary-light text-secondary-contrast  ${
								router.pathname === route ? '!text-brand child:!text-brand' : ''
							}`}
							onClick={() => router.push(route)}
						>
							<div className="inline-block">{routeToIconMap[route]}</div>
							<span className="text-lg">{label}</span>
						</div>
					);
				})}
			</nav>
			<footer className="flex gap-1 h-[52px] p-1 text-secondary-contrast">
				<Avatar />
				<div className="flex flex-col items-start">
					<span className="text-sm m-0">{user.email}</span>
					<SignOutBtn />
				</div>
			</footer>
		</div>
	);
}
