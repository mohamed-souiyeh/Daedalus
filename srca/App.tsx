import React from 'react';
import './App.css';
import { ThemeSwitcher } from './components/ThemeSwitcher';
const useDarkMode = require('use-dark-mode');

function App() {
  const darkMode = useDarkMode(true);

  return (
    <>
    {/* <main className={`${darkMode.value ? 'dark' : ''} text-foreground bg-background`}>
      <ThemeSwitcher /> */}
      <div>
        <h1>
          Daedalus
        </h1>
      </div>
    {/*</main > */}
    </>
  );
}

export default App;