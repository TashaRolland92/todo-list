import { useState, useRef, useEffect } from "react";
import usePrevious from "./components/UsePrevious";
import { nanoid } from "nanoid";
import Todo from "./components/Todo";
import Form from "./components/Form";
import FilterButton from "./components/FilterButton";

const FILTER_MAP = {
	All: () => true,
	Active: (task) => !task.completed,
	Completed: (task) => task.completed,
};

function App(props) {

	function addTask(name) {
		const newTask = { id: `todo-${nanoid()}`, name, completed: false };
		setTasks([...tasks, newTask]);
	}

	function toggleTaskCompleted(id) {
		const updatedTasks = tasks.map((task) => {
			// if this task has the same ID as the edited task
			if(id === task.id) {
				// use object spread to make a new object
      			// whose `completed` prop has been inverted
				return {...task, completed: !task.completed}
			}
			return task;
		});

		setTasks(updatedTasks);
	}

	function deleteTask(id) {
		const remainingTasks = tasks.filter((task) => id !== task.id);
		setTasks(remainingTasks);
	}

	function editTask(id, newName) {
		const editedTaskList = tasks.map((task) => {
			// if this task has the same ID as the edited task
			if(id === task.id) {
				// use object spread to make a new object
	  			// whose `name` prop has been edited
				return {...task, name: newName}
			}
			return task;
		});

		setTasks(editedTaskList);
	}

	const [filter, setFilter] = useState('All');
	const FILTER_NAMES = Object.keys(FILTER_MAP);

	const filterList = FILTER_NAMES.map((name) => (
		<FilterButton
			key={name}
			name={name}
			isPressed={name === filter}
			setFilter={setFilter}
		/>
	));

	const [tasks, setTasks] = useState(props.tasks);
	const taskList = tasks
		.filter(FILTER_MAP[filter])
		.map((task) => (
		<Todo
			id={task.id}
			name={task.name}
			completed={task.completed}
			key={task.id}
			toggleTaskCompleted={toggleTaskCompleted}
			deleteTask={deleteTask}
			editTask={editTask}
		/>
	));

	const remainingTaskCount = tasks.filter((task) => !task.completed).length;
	const tasksNoun = taskList.length !== 1 ? 'tasks' : 'task';
	const headingText = `${remainingTaskCount} ${tasksNoun} remaining`;

	const listHeadingRef = useRef(null);
	const prevTaskLength = usePrevious(tasks.length);

	useEffect(() => {
		if(tasks.length < prevTaskLength) {
			listHeadingRef.current.focus();
		}
	}, [tasks.length, prevTaskLength]);

	const [name, setName] = useState('');
	const hasPromptedRef = useRef(false);

	// Ask for the user's name
	useEffect(() => {
		if (!hasPromptedRef.current) { // prompt only if hasPrompted is false
			const username = window.prompt('Hey, can I ask your name?');
			if (username){
				setName(username);
			}
			hasPromptedRef.current = true; // setting to true so that the prompt doesn't appear again
		}
	}, []);

  	return (
		<div className="todoapp stack-large">
			<h1>{name ? name : 'Guest'}'s Todo List</h1>
			<Form addTask={addTask} />
			<div className="filters btn-group stack-exception">
				{filterList}
			</div>
			<h2 id="list-heading" className="list-heading" tabIndex="-1" ref={listHeadingRef}>
				{headingText}
			</h2>
			<ul
				role="list"
				className="todo-list stack-large stack-exception"
				aria-labelledby="list-heading"
				>
				{taskList}
			</ul>
		</div>
	);
}

export default App;
