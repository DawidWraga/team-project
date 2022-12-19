import { useState, useEffect } from 'react';

export const useIsHydrated = () => {
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated;
};
