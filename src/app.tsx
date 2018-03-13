import * as React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Route } from 'react-router';
import { Dashboard } from './dashboard';
import { examples } from './examples/store';

export class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    {examples.map(ex => (
                        <Route
                            key={ex.label}
                            path={ex.path}
                            component={ex.component}
                        />
                    ))}
                    <Route path={'/'} component={Dashboard} />
                </Switch>
            </BrowserRouter>
        );
    }
}
