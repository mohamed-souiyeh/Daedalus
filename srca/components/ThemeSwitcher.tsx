const useDarkMode = require('use-dark-mode');

export const ThemeSwitcher = () => {
  const darkMode = useDarkMode(false);

  return (
    <div>
      <button onClick={darkMode.disable}>Light Mode</button>
      <button onClick={darkMode.enable}>Dark Mode</button>
    </div>
  )
};