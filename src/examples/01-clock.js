import React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

let time = (() => {
    let t = observable.box(new Date());

    setInterval(() => {
        t.set(new Date());
    }, 1000);

    return t;
})();

@observer
export class Clock extends React.Component {
    render() {
        const value = time.get();
        const timeValue = `${value.getHours()} : ${value.getMinutes()} : ${value.getSeconds()}`;

        return <h3>{timeValue}</h3>;
    }
}
