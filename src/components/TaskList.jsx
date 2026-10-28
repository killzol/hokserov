import TaskItem from './TaskItem.jsx';

export default function TaskList({ tasks, onToggle, onRemove, onRename, search }) {
  if (tasks.length === 0) {
    return <p>{search ? 'Ничего не найдено.' : 'Пока задач нет. Добавь первую выше.'}</p>;
  }

  return (
    <ul>
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onRemove={onRemove}
          onRename={onRename}
        />
      ))}
    </ul>
  );
}
