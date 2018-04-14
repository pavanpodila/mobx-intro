import React from 'react';
import { Link } from 'react-router-dom';
import { examples } from './examples/store';
import { AppBar, Button, Grid, Toolbar, Typography } from 'material-ui';
import { Card, CardContent, CardActions } from 'material-ui';

export class Dashboard extends React.Component {
    render() {
        return (
            <Grid container>
                <AppHeader />

                <Grid container justify={'center'} spacing={24}>
                    {examples.map(ex => (
                        <ExampleCard example={ex} key={ex.path} />
                    ))}
                </Grid>
            </Grid>
        );
    }
}

const AppHeader = function() {
    return (
        <AppBar
            position="static"
            color={'default'}
            style={{ marginBottom: '2rem' }}
        >
            <Toolbar>
                <Typography variant="title" style={{ textAlign: 'center' }}>
                    Intro to MobX
                </Typography>
            </Toolbar>
        </AppBar>
    );
};

function ExampleCard({ example }) {
    const { path, label } = example;

    return (
        <Grid item xs={4}>
            <Card>
                <CardContent>
                    <Typography variant={'title'}>{label}</Typography>
                </CardContent>
                <CardActions>
                    <Link to={path}>
                        <Button
                            size={'large'}
                            variant={'raised'}
                            color={'primary'}
                        >
                            View
                        </Button>
                    </Link>
                </CardActions>
            </Card>
        </Grid>
    );
}
