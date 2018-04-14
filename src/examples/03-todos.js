import { observable, computed, action } from 'mobx';

class TodoListStore {
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
    addTodo(description) {}

    @action
    markComplete(todo) {}

    @action
    markAllComplete() {}

    @action
    clearCompleted() {}
}
