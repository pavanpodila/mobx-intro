import * as React from 'react';
import { SyntheticEvent } from 'react';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import Input from 'antd/lib/input/Input';
import { action, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';
import Button from 'antd/lib/button/button';
import * as validator from 'validate.js';

class FormData {
    @observable username = '';
    @observable password = '';

    @observable.ref validation = null;

    static rules = {
        username: {
            presence: { allowEmpty: false },
        },
        password: {
            presence: { allowEmpty: false },
            length: {
                minimum: 3,
            },
        },
    };

    constructor() {
        reaction(
            () => {
                const { username, password } = this;
                return { username, password };
            },
            () => this.validateFields(),
        );
    }

    @action
    setField(name: string, value: string) {
        this[name] = value;
    }

    @action
    submit() {}

    private validateFields() {
        this.validation = validator.validate(this, FormData.rules);
    }
}
const formData = new FormData();

@observer
export class Form extends React.Component {
    render() {
        const { username, password, validation } = formData;
        return (
            <Row>
                <Col span={12} offset={6}>
                    <FormItem
                        label={'Username'}
                        validateStatus={
                            validation && validation['username']
                                ? 'error'
                                : undefined
                        }
                        help={
                            validation && validation['username']
                                ? validation['username'][0]
                                : undefined
                        }
                        hasFeedback={
                            validation && validation['username']
                                ? true
                                : undefined
                        }
                    >
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
