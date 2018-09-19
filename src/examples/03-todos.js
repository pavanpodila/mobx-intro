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
    Typography,
} from '@material-ui/core';
import { observer } from 'mobx-react';
import DevTools from 'mobx-react-devtools';

class Todo {
    @observable
    description = '';
    @observable
    done = false;

    id = null;

    static counter = 0;

    constructor(description) {
        this.description = description;
        this.id = `todo-${Todo.counter++}`;
    }
}

class TodoList {
    @observable.shallow
    todos = [];
    @observable
    currentDescription = '';
    @observable
    filter = 'all'; // all | active | completed

    constructor() {
        this.addTodo('give a talk');
        this.addTodo('take a break');
    }

    //region Computed Properties
    @computed
    get itemsPendingDescription() {
        const count = this.pendingTodos.length;
        return `${count} ${count === 1 ? 'item' : 'items'} remaining`;
    }

    @computed
    get pendingTodos() {
        return this.todos.filter(x => x.done === false);
    }

    @computed
    get hasPendingTodos() {
        return this.pendingTodos.length > 0;
    }

    @computed
    get completedTodos() {
        return this.todos.filter(x => x.done);
    }

    @computed
    get hasCompletedTodos() {
        return this.completedTodos.length > 0;
    }

    @computed
    get visibleTodos() {
        switch (this.filter) {
            case 'pending':
                return this.pendingTodos;
            case 'completed':
                return this.completedTodos;
            default:
                return this.todos;
        }
    }
    //endregion

    //region Actions
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
        const actualValue = description.trim();
        if (actualValue === '') {
            return;
        }

        const todo = new Todo(actualValue);
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
    //endregion
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
        <Grid container direction={'row'} spacing={24} alignItems={'center'}>
            <Grid item>
                <ItemDescription />
            </Grid>

            <Grid item>
                <ActionButton
                    attr={'hasPendingTodos'}
                    onClick={actions.completeAll}
                >
                    Complete All
                </ActionButton>
                <ActionButton
                    attr={'hasCompletedTodos'}
                    onClick={actions.removeCompleted}
                >
                    Remove Completed
                </ActionButton>
            </Grid>
            <Grid item>
                <TodoFilter />
            </Grid>
        </Grid>
    );
}

const ActionButton = observer(({ attr, children, onClick }) => {
    return (
        <Button
            variant={'raised'}
            size={'small'}
            onClick={onClick}
            disabled={!todoListStore[attr]}
            style={{ marginLeft: 10 }}
        >
            {children}
        </Button>
    );
});

const ItemDescription = observer(() => {
    const { itemsPendingDescription } = todoListStore;

    return <Typography>{itemsPendingDescription}</Typography>;
});

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
                value={'pending'}
                label={'Pending'}
            />
            <FormControlLabel
                control={<Radio />}
                value={'completed'}
                label={'Completed'}
            />
        </RadioGroup>
    );
});
