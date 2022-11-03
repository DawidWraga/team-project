import React, { createContext, useContext, useState } from 'react';

export interface IGlobalContext {
	activePage: { [key: string]: any };
	setActivePage: React.Dispatch<React.SetStateAction<{ [key: string]: any }>>;
}

export const GlobalContext = createContext<IGlobalContext>(
	{} as IGlobalContext
);

export const GlobalContextProvider: React.FC<{
	children: React.ReactNode;
}> = ({ children }) => {
	const [activePage, setActivePage] = useState(null);

	return (
		<GlobalContext.Provider
			value={{
				activePage,
				setActivePage,
			}}
		>
			{children}
		</GlobalContext.Provider>
	);
};

export const useGlobalContext = () => useContext(GlobalContext);
