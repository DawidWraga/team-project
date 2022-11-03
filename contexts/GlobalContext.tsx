import React, { createContext, useContext, useState } from 'react';

export interface IGlobalContext {
	activePage: { [key: string]: any };
	setActivePage: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
	sideNavIsOpen: boolean;
	setSideNavIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GlobalContext = createContext<IGlobalContext>(
	{} as IGlobalContext
);

export const GlobalContextProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [activePage, setActivePage] = useState(null);
	const [sideNavIsOpen, setSideNavIsOpen] = useState(false);

	return (
		<GlobalContext.Provider
			value={{
				activePage,
				setActivePage,
				sideNavIsOpen,
				setSideNavIsOpen,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

export const useGlobalContext = () => useContext(GlobalContext);
