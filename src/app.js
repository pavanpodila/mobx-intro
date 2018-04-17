import React from 'react';
import { Dashboard } from './dashboard';
import { examples } from './examples';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

export class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    {examples.map(ex => (
                        <Route
                            exact
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
