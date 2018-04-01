import React from 'react';
import Row from 'antd/lib/grid/row';
import Col from 'antd/lib/grid/col';
import Input from 'antd/lib/input/Input';
import { action, observable, reaction } from 'mobx';
import { observer } from 'mobx-react';
import FormItem from 'antd/lib/form/FormItem';
import Button from 'antd/lib/button/button';
import validator from 'validate.js';

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
    setField(name, value) {
        this[name] = value;
    }

    @action
    submit() {
        this.validateFields();
    }

    validateFields() {
        this.validation = validator.validate(this, FormData.rules);
    }
}

const formData = new FormData();

@observer
export class Form extends React.Component {
    render() {
        const { password, validation } = formData;
        return (
            <Row>
                <Col span={12} offset={6}>
                    <ValidatedInput
                        label={'Username'}
                        fieldName={'username'}
                        entity={formData}
                        validation={validation}
                        onChange={this.setUsername}
                    />

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

    setUsername = event => {
        formData.setField('username', event.target.value);
    };

    setPassword = event => {
        formData.setField('password', event.target.value);
    };

    login = () => {
        formData.submit();
    };
}

const ValidatedInput = observer(
    ({ label, entity, fieldName, onChange, validation }) => {
        return (
            <FormItem
                label={label}
                validateStatus={
                    validation && validation[fieldName] ? 'error' : undefined
                }
                help={
                    validation && validation[fieldName]
                        ? validation[fieldName][0]
                        : undefined
                }
                hasFeedback={
                    validation && validation[fieldName] ? true : undefined
                }
            >
                <Input value={entity[fieldName]} onChange={onChange} />
            </FormItem>
        );
    },
);
