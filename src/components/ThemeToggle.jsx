import { useTheme } from './ThemeContext.jsx';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  function handleClick() {
    setTheme(theme === 'light' ? 'dark' : 'light');
  }

  return (
    <button type="button" onClick={handleClick}>
      {theme === 'light' ? 'Тёмная' : 'Светлая'}
    </button>
  );
}