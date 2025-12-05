"use client";
import { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [isCreative, setIsCreative] = useState(false);

  return (
    <StateContext.Provider value={{ isCreative, setIsCreative }}>
      {children}
    </StateContext.Provider>
  );
};

export const useStateContext = () => useContext(StateContext);
