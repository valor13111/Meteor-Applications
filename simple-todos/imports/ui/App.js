import React from 'react';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.js';

// App component - representing whole App
// Uses a task component to render the list of items
// initialize states here
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTodoValue: '',
      hideCompleted: false,
    };
  }

  // handles the change of input box, and updates state
  handleChange = (event) => {
    this.setState({
      newTodoValue: event.target.value
    });
  }

  // handles the submission by inserting new task into mongodb with date
  handleSubmit = (event) => {
    event.preventDefault();

    Tasks.insert({
      text: this.state.newTodoValue,
      createdAt: new Date(), // current time
    });

    // Clear form
    this.setState({
      newTodoValue: '',
    });
  }

  // toggle the state of checkbox to ONLY show incomplete tasks
  toggleHideCompleted = () => {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  // render the tasks by Using a Task Component
  renderTasks() {
    let filteredTasks = this.props.tasks;

    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render() {
    return(
      <div className="container">
        <header>
          <h1>Todo List ({this.props.incompleteCount})</h1>

          <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={ this.state.hideCompleted }
              onClick={ this.toggleHideCompleted.bind(this) }
            />
            Hide Completed Tasks
          </label>

          <form className="new-task" onSubmit={ this.handleSubmit.bind(this) } >
            <input
              type="text"
              ref="textInput"
              placeholder="Type to add new tasks"
              onChange={ this.handleChange.bind(this) }
              value={ this.state.newTodoValue }
            />
          </form>
        </header>

        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

export default withTracker(() => {
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
  };
})(App);
