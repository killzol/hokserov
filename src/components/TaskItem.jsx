import { memo } from 'react';

const TaskItem = memo(function TaskItem({ task, onToggle, onRemove, onRename }) {
  console.log('Рисуем задачу:', task.text);

  function renameTask() {
    const text = window.prompt('Введите новое название задачи:', task.text);
    if (text === null || !text.trim()) return;
    onRename(task.id, text.trim());
  }

  return (
    <li className={task.done ? 'done' : ''}>
      <label>
        <input
          type="checkbox"
          checked={task.done}
          onChange={() => onToggle(task.id)}
        />
        <span>{task.text}</span>
      </label>
      <div className="actions">
        <button className="edit" type="button" onClick={renameTask}>
          Редактировать
        </button>
        <button type="button" onClick={() => onRemove(task.id)}>
          ×
        </button>
      </div>
    </li>
  );
});

export default TaskItem;
