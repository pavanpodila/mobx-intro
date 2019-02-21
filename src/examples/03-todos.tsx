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
import { Observer, observer } from 'mobx-react';
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

enum VisibilityFilter {
    all = 'all',
    pending = 'active',
    completed = 'completed',
}

class TodoList {
    @observable.shallow
    public todos: Todo[] = [];

    @observable
    public currentDescription = '';

    @observable
    public filter: VisibilityFilter = VisibilityFilter.all;

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
    get canMarkAllCompleted() {
        return (
            this.filter !== VisibilityFilter.completed && this.hasPendingTodos
        );
    }

    @computed
    get canRemoveCompleted() {
        return (
            this.filter !== VisibilityFilter.pending && this.hasCompletedTodos
        );
    }

    @computed
    get visibleTodos() {
        switch (this.filter) {
            case VisibilityFilter.pending:
                return this.pendingTodos;
            case VisibilityFilter.completed:
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
    public setFilter(filter: VisibilityFilter) {
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
                <Observer>
                    {() => (
                        <Button
                            variant={'raised'}
                            size={'small'}
                            onClick={actions.completeAll}
                            disabled={!todoListStore.canMarkAllCompleted}
                            style={{ marginLeft: 10 }}
                        >
                            Complete All
                        </Button>
                    )}
                </Observer>
                <Observer>
                    {() => (
                        <Button
                            variant={'raised'}
                            size={'small'}
                            onClick={actions.removeCompleted}
                            disabled={!todoListStore.canRemoveCompleted}
                            style={{ marginLeft: 10 }}
                        >
                            Remove Completed
                        </Button>
                    )}
                </Observer>
            </Grid>
            <Grid item={true}>
                <TodoFilter />
            </Grid>
        </Grid>
    );
};

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
            onChange={(event, value) =>
                todoListStore.setFilter(value as VisibilityFilter)
            }
        >
            <FormControlLabel
                control={<Radio />}
                value={VisibilityFilter.all}
                label={'All'}
            />
            <FormControlLabel
                control={<Radio />}
                value={VisibilityFilter.pending}
                label={'Pending'}
            />
            <FormControlLabel
                control={<Radio />}
                value={VisibilityFilter.completed}
                label={'Completed'}
            />
        </RadioGroup>
    );
});
