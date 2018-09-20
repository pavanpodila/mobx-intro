import React, { StatelessComponent } from 'react';
import { Link } from 'react-router-dom';
import { Example, examples } from './examples';
import {
    AppBar,
    Button,
    Card,
    CardActions,
    CardContent,
    Grid,
    Toolbar,
    Typography,
} from '@material-ui/core';

export class Dashboard extends React.Component {
    public render() {
        return (
            <Grid container={true}>
                <AppHeader />

                <Grid container={true} justify={'flex-start'} spacing={24}>
                    {examples.map(ex => (
                        <ExampleCard example={ex} key={ex.path} />
                    ))}
                </Grid>
            </Grid>
        );
    }
}

const AppHeader = () => {
    return (
        <AppBar
            position="static"
            color={'default'}
            style={{ marginBottom: '2rem' }}
        >
            <Toolbar>
                <Typography
                    variant="title"
                    style={{ textAlign: 'center', flex: 1 }}
                >
                    Intro to MobX
                </Typography>

                <Button href={'https://github.com/pavanpodila/mobx-intro'}>
                    Source Code
                </Button>
            </Toolbar>
        </AppBar>
    );
};

interface ExampleCardProps {
    example: Example;
}

const ExampleCard: StatelessComponent<ExampleCardProps> = ({ example }) => {
    const { path, label, description } = example;

    return (
        <Grid item={true} xs={6} md={4}>
            <Card>
                <CardContent>
                    <Typography variant={'title'}>{label}</Typography>
                    <Typography variant={'subheading'}>
                        {description}
                    </Typography>
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
};
