import React from 'react';
import { Typography } from 'material-ui';

export class Clock extends React.Component {
    render() {
        const value = new Date();
        const timeValue = `${value.getHours()} : ${value.getMinutes()} : ${value.getSeconds()}`;

        return (
            <Typography style={{ textAlign: 'center' }} variant={'display4'}>
                {timeValue}
            </Typography>
        );
    }
}
