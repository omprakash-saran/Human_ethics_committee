import { useState, createContext, useContext, useEffect } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  return useContext(ThemeContext);
};

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(JSON.parse(localStorage.getItem('darkmode') || false));

  const toggleTheme = () => {
    setDarkMode((mode) => {
      localStorage.setItem('darkmode', !mode);
      return !mode;
    });
  };
  // useEffect(()=>{
  //   setDarkMode((mode)=> {
  //     const a = localStorage.getItem('darkmode') ;
  //     if(a == null) return false;
  //     return JSON.parse(a);
  //   });
  // },[])

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ toggleTheme, darkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};