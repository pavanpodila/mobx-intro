import { observable, computed, action } from 'mobx';

class Todo {
    @observable description = '';
    @observble done = false;

    constructor(description) {
        this.description = description;
    }
}

class TodoList {
    @observable todos = [];

    @computed
    get activeTodos() {
        return this.todos.filter(x => x.done === false);
    }

    @computed
    get completedTodos() {
        return this.todos.filter(x => x.done);
    }

    @action
    addTodo(description) {
        const todo = new Todo(description);
        this.todos.push(todo);
    }

    @action.bound
    markComplete(todo) {
        todo.done = true;
    }

    @action
    markAllComplete() {
        this.todos.forEach(this.markComplete);
    }

    @action
    clearCompleted() {
        this.todos = this.todos.filter(todo => todo.done);
    }
}
