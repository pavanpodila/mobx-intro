import React from 'react';
import { Dashboard } from './dashboard';
import { examples } from './examples';
import { HashRouter, Route, Switch } from 'react-router-dom';

export class App extends React.Component {
    public render() {
        return (
            <HashRouter>
                <Switch>
                    {examples.map(ex => (
                        <Route
                            exact={true}
                            key={ex.label}
                            path={ex.path}
                            component={ex.component}
                        />
                    ))}
                    <Route path={'/'} component={Dashboard} />
                </Switch>
            </HashRouter>
        );
    }
}
