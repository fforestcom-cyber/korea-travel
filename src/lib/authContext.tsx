import { createContext, useContext } from 'react';
export const OwnerContext = createContext(false);
export const useIsOwner = () => useContext(OwnerContext);
