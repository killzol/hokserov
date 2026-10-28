import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { tasksReducer } from './tasksReducer.js';
import { useTheme } from './ThemeContext.jsx';
import { useLanguage } from './LanguageContext.jsx';
import AddTaskForm from './components/AddTaskForm.jsx';
import TaskList from './components/TaskList.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import LanguageToggle from './components/LanguageToggle.jsx';

const translations = {
  ru: {
    title: 'Менеджер задач', add: 'Добавить', addLabel: 'Новая задача', placeholder: 'Например, закончить проект',
    all: 'Все', active: 'Активные', done: 'Готовые', total: 'Всего', completed: 'выполнено',
    emptyList: 'Пока задач нет. Добавьте первую выше.', emptySearch: 'Совпадений не найдено.',
    search: 'Поиск задач', searchHint: 'Найти задачу…', taskList: 'Список задач',
    darkTheme: 'Тёмная', lightTheme: 'Светлая', themeToggle: 'Переключить тему', languageToggle: 'Переключить язык',
    rename: 'Редактировать', renamePrompt: 'Введите новое название задачи:', remove: 'Удалить задачу',
    clearDone: 'Удалить выполненные', clearAll: 'Очистить список', clearConfirm: 'Удалить все задачи? Это действие нельзя отменить.',
    shortcut: 'Нажмите /, чтобы перейти к поиску', percent: 'прогресс',
  },
  en: {
    title: 'Task Manager', add: 'Add task', addLabel: 'New task', placeholder: 'For example, finish the project',
    all: 'All', active: 'Active', done: 'Done', total: 'Total', completed: 'completed',
    emptyList: 'No tasks yet. Add your first one above.', emptySearch: 'No matches found.',
    search: 'Search tasks', searchHint: 'Find a task…', taskList: 'Task list',
    darkTheme: 'Dark', lightTheme: 'Light', themeToggle: 'Toggle theme', languageToggle: 'Switch language',
    rename: 'Edit task', renamePrompt: 'Enter a new task name:', remove: 'Remove task',
    clearDone: 'Clear completed', clearAll: 'Clear all', clearConfirm: 'Delete all tasks? This cannot be undone.',
    shortcut: 'Press / to jump to search', percent: 'progress',
  },
};

export default function App() {
  const [tasks, dispatch] = useReducer(tasksReducer, []);
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const searchRef = useRef(null);
  const { theme } = useTheme();
  const { language } = useLanguage();
  const copy = translations[language];

  const handleAdd = useCallback((text) => {
    dispatch({ type: 'add', task: { id: crypto.randomUUID(), text, done: false } });
  }, []);
  const handleToggle = useCallback((id) => dispatch({ type: 'toggle', id }), []);
  const handleRemove = useCallback((id) => dispatch({ type: 'remove', id }), []);
  const handleRename = useCallback((id, text) => dispatch({ type: 'rename', id, text }), []);

  const doneCount = useMemo(() => tasks.filter((task) => task.done).length, [tasks]);
  const completionPercent = useMemo(
    () => (tasks.length === 0 ? 0 : Math.round((doneCount / tasks.length) * 100)),
    [doneCount, tasks.length],
  );
  const visibleTasks = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase(language === 'ru' ? 'ru' : 'en');
    return tasks.filter((task) => {
      const matchesFilter = filter === 'done' ? task.done : filter === 'active' ? !task.done : true;
      const matchesQuery = task.text.toLocaleLowerCase(language === 'ru' ? 'ru' : 'en').includes(normalizedQuery);
      return matchesFilter && matchesQuery;
    });
  }, [tasks, filter, query, language]);

  useEffect(() => {
    function handleKeyDown(event) {
      const target = event.target;
      const isTyping = target instanceof HTMLElement && (
        target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)
      );
      if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey && !isTyping) {
        event.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  function clearAll() {
    if (window.confirm(copy.clearConfirm)) dispatch({ type: 'clearAll' });
  }

  const filters = [
    { key: 'all', label: copy.all },
    { key: 'active', label: copy.active },
    { key: 'done', label: copy.done },
  ];

  return (
    <main className={`app-shell theme-${theme}`}>
      <section className="task-card" aria-labelledby="app-title">
        <header className="app-header">
          <div className="brand-lockup">
            <span className="brand-mark" aria-hidden="true">
              <svg viewBox="0 0 32 32"><path d="m8 16 5.2 5.2L24.5 10" /></svg>
            </span>
            <div>
              <p className="eyebrow">DAY BY DAY</p>
              <h1 id="app-title">{copy.title}</h1>
            </div>
          </div>
          <div className="header-actions">
            <LanguageToggle copy={copy} />
            <ThemeToggle copy={copy} />
          </div>
        </header>

        <AddTaskForm onAdd={handleAdd} copy={copy} />

        <div className="toolbar">
          <div className="filter-tabs" role="tablist" aria-label={copy.taskList}>
            {filters.map(({ key, label }) => (
              <button
                key={key}
                className={`filter-tab${filter === key ? ' selected' : ''}`}
                type="button"
                role="tab"
                aria-selected={filter === key}
                onClick={() => setFilter(key)}
              >{label}</button>
            ))}
          </div>
          <label className="search-box">
            <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.8" cy="8.8" r="5.5" /><path d="m13 13 4 4" /></svg>
            <span className="sr-only">{copy.search}</span>
            <input ref={searchRef} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={copy.searchHint} />
            {!query && <kbd>/</kbd>}
            {query && <button type="button" className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
          </label>
        </div>

        <section className="summary" aria-label={copy.total}>
          <div className="summary-topline">
            <p><strong>{copy.total}: {tasks.length}</strong><span className="summary-dot">·</span>{copy.completed}: {doneCount}</p>
            <p className="completion-label">{completionPercent}% {copy.percent}</p>
          </div>
          <div className="progress-track" role="progressbar" aria-label={copy.percent} aria-valuenow={completionPercent} aria-valuemin="0" aria-valuemax="100">
            <span style={{ width: `${completionPercent}%` }} />
          </div>
        </section>

        <TaskList
          tasks={visibleTasks}
          onToggle={handleToggle}
          onRemove={handleRemove}
          onRename={handleRename}
          copy={copy}
          searchQuery={query}
        />

        <footer className="list-footer">
          <span>{copy.shortcut}</span>
          <div className="list-footer-actions">
            {doneCount > 0 && <button type="button" onClick={() => dispatch({ type: 'clearDone' })}>{copy.clearDone}</button>}
            {tasks.length > 0 && <button type="button" onClick={clearAll}>{copy.clearAll}</button>}
          </div>
        </footer>
      </section>
      <p className="page-note">A little progress, every day.</p>
    </main>
  );
}
