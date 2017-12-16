import React from 'react';
import { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';

import { Tasks } from '../api/tasks.js';

import Task from './Task.js';

// App component - representing whole App
// Uses a task component to render the list of items
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newTodoValue: '',
    };
  }


  handleChange = (event) => {
    this.setState({
      newTodoValue: event.target.value
    });
  }


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

  renderTasks() {
    return this.props.tasks.map((task) => (
      <Task key={task._id} task={task} />
    ));
  }

  render() {
    return(
      <div className="container">
        <header>
          <h1>Todo List</h1>

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
  };
})(App);
