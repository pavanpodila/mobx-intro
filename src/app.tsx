import * as React from 'react';
import { BrowserRouter, Switch } from 'react-router-dom';
import { Route } from 'react-router';
import { Clock } from './examples/01-clock';
import { Dashboard } from './dashboard';

export class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path={'/examples/01'} component={Clock} />
                    <Route path={'/examples/02'} component={Clock} />
                    <Route path={'/'} component={Dashboard} />
                </Switch>
            </BrowserRouter>
        );
    }
}
