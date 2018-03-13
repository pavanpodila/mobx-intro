import * as React from 'react';
import { Link } from 'react-router-dom';
import { examples } from './examples/store';

export class Dashboard extends React.Component {
    render() {
        return (
            <ul>
                {examples.map(example => (
                    <li key={example.label}>
                        <Link to={example.path}>{example.label}</Link>
                    </li>
                ))}
            </ul>
        );
    }
}
