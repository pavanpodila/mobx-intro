import * as React from 'react';
import { SyntheticEvent } from 'react';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import Input from 'antd/lib/input/Input';
import { action, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';
import Button from 'antd/lib/button/button';

class FormData {
    @observable username = '';
    @observable password = '';

    constructor() {
        reaction(
            () => {
                const { username, password } = this;
                return { username, password };
            },
            () => {},
        );
    }

    @action
    setField(name: string, value: string) {
        this[name] = value;
    }

    @action
    submit() {}
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
                        <Input value={username} onChange={this.setUsername} />
                    </FormItem>

                    <FormItem label={'Password'}>
                        <Input
                            value={password}
                            onChange={this.setPassword}
                            type={'password'}
                        />
                    </FormItem>

                    <Button
                        onClick={this.login}
                        type={'primary'}
                        size={'large'}
                    >
                        Login
                    </Button>
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

    login = () => {
        formData.submit();
    };
}
