import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { tasksReducer } from './tasksReducer.js';
import AddTaskForm from './components/AddTaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import { useTheme } from './components/ThemeContext.jsx';
import { ThemeToggle } from './components/ThemeToggle.jsx';
import { useLanguage } from './components/LanguageContext.jsx';
import { LanguageToggle } from './components/LanguageToggle.jsx';

export default function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, []);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const searchRef = useRef(null);
  const { theme } = useTheme();
  const { language } = useLanguage();

  const handleAdd = useCallback((text) => {
    dispatch({
      type: 'add',
      task: { id: Date.now(), text, done: false },
    });
  }, []);

  const handleToggle = useCallback((id) => {
    dispatch({ type: 'toggle', id });
  }, []);

  const handleRemove = useCallback((id) => {
    dispatch({ type: 'remove', id });
  }, []);

  const handleRename = useCallback((id, text) => {
    dispatch({ type: 'rename', id, text });
  }, []);

  const doneCount = useMemo(
    () => tasks.filter((task) => task.done).length,
    [tasks],
  );

  const percent = useMemo(
    () => tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100),
    [doneCount, tasks.length],
  );

  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const byFilter =
        filter === 'all' ||
        (filter === 'active' && !task.done) ||
        (filter === 'done' && task.done);
      const byText = task.text.toLowerCase().includes(query);
      return byFilter && byText;
    });
  }, [tasks, filter, search]);

  useEffect(() => {
    function handleKeyDown(event) {
      const tag = event.target.tagName;
      const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag);

      if (event.key === '/' && !typing) {
        event.preventDefault();
        searchRef.current.focus();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`app ${theme}`}>
      <div className="card">
        <header className="app-header">
          <h1>{language === 'ru' ? 'Менеджер задач' : 'Task Manager'}</h1>
          <div>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </header>

        <AddTaskForm onAdd={handleAdd} />

        <input
          ref={searchRef}
          className="search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Поиск задач (нажми /)"
          aria-label="Поиск задач"
        />

        <div className="filters">
          <button type="button" className={filter === 'all' ? 'selected' : ''} onClick={() => setFilter('all')}>
            Все
          </button>
          <button type="button" className={filter === 'active' ? 'selected' : ''} onClick={() => setFilter('active')}>
            Активные
          </button>
          <button type="button" className={filter === 'done' ? 'selected' : ''} onClick={() => setFilter('done')}>
            Готовые
          </button>
        </div>

        <p className="task-count">
          Всего: {tasks.length}, выполнено: {doneCount} <span className="percent">({percent}%)</span>
        </p>

        <TaskList
          tasks={visibleTasks}
          onToggle={handleToggle}
          onRemove={handleRemove}
          onRename={handleRename}
          search={search}
        />
      </div>
    </div>
  );
}

