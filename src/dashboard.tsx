import * as React from 'react';
import { Fragment } from 'react';
import { Link } from 'react-router-dom';

const examples = [
    { label: 'Clock', path: '/examples/01' },
    { label: 'Form Handling', path: '/examples/02' },
];

export class Dashboard extends React.Component {
    render() {
        return (
            <Fragment>
                {examples.map(example => (
                    <Link to={example.path}>{example.label}</Link>
                ))}
            </Fragment>
        );
    }
}
