import React, { createContext, useContext, useState } from 'react';

export interface IGlobalContext {
	sideNavIsOpen: boolean;
	setSideNavIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const GlobalContext = createContext<IGlobalContext>(
	{} as IGlobalContext
);

export const GlobalContextProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [sideNavIsOpen, setSideNavIsOpen] = useState(false);

	return (
		<GlobalContext.Provider
			value={{
				sideNavIsOpen,
				setSideNavIsOpen,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

export const useGlobalContext = () => useContext(GlobalContext);
