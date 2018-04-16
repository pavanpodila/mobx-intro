import { action, computed, observable } from 'mobx';
import React, { Fragment } from 'react';
import {
    Button,
    Checkbox,
    FormControlLabel,
    Grid,
    List,
    ListItem,
    ListItemText,
    Paper,
    Radio,
    RadioGroup,
    TextField,
} from 'material-ui';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

class Todo {
    @observable description = '';
    @observable done = false;

    id = null;

    static counter = 0;

    constructor(description) {
        this.description = description;
        this.id = `todo-${Todo.counter++}`;
    }
}

class TodoList {
    @observable.shallow todos = [];
    @observable currentDescription = '';
    @observable filter = 'all'; // all | active | completed

    constructor() {
        this.addTodo('give a talk');
        this.addTodo('take a break');
    }

    @computed
    get activeTodos() {
        return this.todos.filter(x => x.done === false);
    }

    @computed
    get completedTodos() {
        return this.todos.filter(x => x.done);
    }

    @computed
    get visibleTodos() {
        switch (this.filter) {
            case 'active':
                return this.activeTodos;
            case 'completed':
                return this.completedTodos;
            default:
                return this.todos;
        }
    }

    @action
    setDescription(description) {
        this.currentDescription = description;
    }

    @action
    setFilter(filter) {
        this.filter = filter;
    }

    @action
    addTodo(description) {
        const todo = new Todo(description);
        this.todos.push(todo);

        this.currentDescription = '';
    }

    @action.bound
    markComplete(todo, flag = true) {
        todo.done = flag;
    }

    @action.bound
    markAllComplete() {
        this.todos.forEach(t => this.markComplete(t, true));
    }

    @action.bound
    removeCompleted() {
        this.todos = this.todos.filter(todo => !todo.done);
    }
}

const todoListStore = new TodoList();

@observer
export class TodoListComponent extends React.Component {
    render() {
        const { visibleTodos } = todoListStore;

        return (
            <Fragment>
                <DevTools />

                <TodoInput onEnter={this.onEnterKey} />

                <TodoToolbar
                    actions={{
                        completeAll: todoListStore.markAllComplete,
                        removeCompleted: todoListStore.removeCompleted,
                    }}
                />

                <List style={{ width: '100%' }} disablePadding={true}>
                    {visibleTodos.map(t => (
                        <TodoItem
                            todo={t}
                            key={t.id}
                            markDone={todoListStore.markComplete}
                        />
                    ))}
                </List>
            </Fragment>
        );
    }

    onEnterKey = () => {
        todoListStore.addTodo(todoListStore.currentDescription);
    };
}

const TodoItem = observer(({ todo, markDone }) => {
    return (
        <ListItem divider={true}>
            <Checkbox
                checked={todo.done}
                onChange={event => markDone(todo, event.target.checked)}
            />
            <ListItemText primary={todo.description} />
        </ListItem>
    );
});

const TodoInput = observer(({ onEnter }) => {
    const { currentDescription } = todoListStore;

    return (
        <Paper style={{ width: '100%', padding: 10, marginBottom: 20 }}>
            <TextField
                fullWidth={true}
                placeholder={'Add todo'}
                autoFocus={true}
                value={currentDescription}
                onChange={event =>
                    todoListStore.setDescription(event.target.value)
                }
                onKeyUp={event => {
                    if (event.keyCode !== 13) {
                        return;
                    }

                    onEnter();
                }}
                inputProps={{ style: { fontSize: 20 } }}
            />
        </Paper>
    );
});

function TodoToolbar({ actions }) {
    return (
        <Grid container direction={'row'} spacing={24}>
            <Grid item xs={6}>
                <Button
                    variant={'raised'}
                    size={'small'}
                    style={{ marginRight: 10 }}
                    onClick={actions.completeAll}
                >
                    Complete All
                </Button>
                <Button
                    variant={'raised'}
                    size={'small'}
                    onClick={actions.removeCompleted}
                >
                    Remove Completed
                </Button>
            </Grid>
            <Grid item xs={6}>
                <TodoFilter />
            </Grid>
        </Grid>
    );
}

const TodoFilter = observer(() => {
    const { filter } = todoListStore;

    return (
        <RadioGroup
            style={{ flexDirection: 'row' }}
            value={filter}
            onChange={(event, value) => todoListStore.setFilter(value)}
        >
            <FormControlLabel control={<Radio />} value={'all'} label={'All'} />
            <FormControlLabel
                control={<Radio />}
                value={'active'}
                label={'Active'}
            />
            <FormControlLabel
                control={<Radio />}
                value={'completed'}
                label={'Completed'}
            />
        </RadioGroup>
    );
});
