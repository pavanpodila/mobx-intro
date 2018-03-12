import * as React from 'react';
import { SyntheticEvent } from 'react';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import Input from 'antd/lib/input/Input';
import { action, observable } from 'mobx';
import { observer } from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';

class FormData {
    @observable username = '';
    @observable password = '';

    @action
    setField(name: string, value: string) {
        this[name] = value;
    }
}
const formData = new FormData();

@observer
export class Form extends React.Component {
    render() {
        const { username, password } = formData;
        return (
            <Row>
                <Col span={12} offset={6}>
                    <FormItem label={'Username'}>
                        {' '}
                        <Input value={username} onChange={this.setUsername} />
                    </FormItem>
                    <FormItem>
                        {' '}
                        <Input
                            value={password}
                            onChange={this.setPassword}
                            type={'password'}
                        />
                    </FormItem>{' '}
                </Col>
            </Row>
        );
    }

    setUsername = (event: SyntheticEvent<HTMLInputElement>) => {
        formData.setField('username', event.currentTarget.value);
    };

    setPassword = (event: SyntheticEvent<HTMLInputElement>) => {
        formData.setField('password', event.currentTarget.value);
    };
}
