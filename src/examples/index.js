import { Clock } from './01-clock';
import { Form } from './02-form';
import { AppBar, Button, Grid, Toolbar, Typography } from 'material-ui';
import React from 'react';
import ArrowBack from '@material-ui/icons/ArrowBack';
import { Link } from 'react-router-dom';
import { TodoListComponent } from './03-todos';

const withContainer = (Component, title) => {
    return () => (
        <Grid container>
            <AppBar
                position="static"
                color={'default'}
                style={{ marginBottom: '2rem' }}
            >
                <Toolbar>
                    <Link to={'/'} style={{ textDecoration: 'none' }}>
                        <Button color={'secondary'}>
                            <ArrowBack />
                            Back
                        </Button>
                    </Link>

                    <Typography
                        variant="title"
                        color="inherit"
                        style={{ marginLeft: 10 }}
                    >
                        {title}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Grid container justify={'center'}>
                <Component />
            </Grid>
        </Grid>
    );
};

export const examples = [
    {
        label: 'Clock',
        description: 'A simple clock component that ticks every second',
        path: '/examples/01',
        component: withContainer(Clock, 'Clock'),
    },
    {
        label: 'Login Form',
        description:
            'A form showing the use of store, actions, async validations',
        path: '/examples/02',
        component: withContainer(Form, 'Login Form'),
    },
    {
        label: 'Todo Store',
        description:
            'Todo lists with stores, actions, computed-properties and so on',
        path: '/examples/03',
        component: withContainer(TodoListComponent, 'Todo Store'),
    },
];
