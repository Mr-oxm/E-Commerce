import { createContext, useState, useContext, useEffect } from "react";


// create sign in context
const ThemeContext = createContext();

// the context accessor
export const useThemeContext = () => {
  return useContext(ThemeContext);
};

// the context provider
export const ThemeContextProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || "dark";
  });

  // Update localStorage when theme changes
  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme:theme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
