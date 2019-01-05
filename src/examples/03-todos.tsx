import { action, computed, observable } from 'mobx';
import React, { Fragment, FunctionComponent } from 'react';
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

declare var window: {
    todoListStore: TodoList;
    [key: string]: any;
};
class Todo {
    public static counter = 0;
    @observable
    public description = '';
    @observable
    public done = false;

    public id: string | null = null;

    constructor(description: string) {
        this.description = description;
        this.id = `todo-${Todo.counter++}`;
    }
}

class TodoList {
    @observable.shallow
    public todos: Todo[] = [];

    @observable
    public currentDescription = '';

    @observable
    public filter = 'all'; // all | active | completed

    constructor() {
        this.addTodo('give a talk');
        this.addTodo('take a break');
    }

    // region Computed Properties
    @computed
    get itemsPendingDescription() {
        const count = this.pendingTodos.length;
        return `${count} ${count === 1 ? 'item' : 'items'} remaining`;
    }

    @computed
    get pendingTodos() {
        return this.todos.filter(x => !x.done);
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
    // endregion

    // region Actions
    @action
    public setDescription(description: string) {
        this.currentDescription = description;
    }

    @action
    public setFilter(filter: string) {
        this.filter = filter;
    }

    @action
    public addTodo(description: string) {
        const actualValue = description.trim();
        if (actualValue === '') {
            return;
        }

        const todo = new Todo(actualValue);
        this.todos.push(todo);

        this.currentDescription = '';
    }

    @action.bound
    public markComplete(todo: Todo, flag = true) {
        todo.done = flag;
    }

    @action.bound
    public markAllComplete() {
        this.todos.forEach(t => this.markComplete(t, true));
    }

    @action.bound
    public removeCompleted() {
        this.todos = this.todos.filter(todo => !todo.done);
    }
    // endregion
}

const todoListStore = new TodoList();
window.todoStore = todoListStore;

@observer
export class TodoListComponent extends React.Component {
    public render() {
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

    public onEnterKey = () => {
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

interface TodoToolbarProps {
    actions: {
        completeAll: () => void;
        removeCompleted: () => void;
    };
}
const TodoToolbar: FunctionComponent<TodoToolbarProps> = ({ actions }) => {
    return (
        <Grid
            container={true}
            direction={'row'}
            spacing={24}
            alignItems={'center'}
        >
            <Grid item={true}>
                <ItemDescription />
            </Grid>

            <Grid item={true}>
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
            <Grid item={true}>
                <TodoFilter />
            </Grid>
        </Grid>
    );
};

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
