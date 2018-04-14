import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { Typography } from 'material-ui';

let time = observable.box(new Date());

setInterval(() => {
    time.set(new Date());
}, 1000);

@observer
export class Clock extends React.Component {
    render() {
        const value = time.get();
        const timeValue = `${value.getHours()} : ${value.getMinutes()} : ${value.getSeconds()}`;

        return (
            <Typography style={{ textAlign: 'center' }} variant={'display4'}>
                {timeValue}
            </Typography>
        );
    }
}
