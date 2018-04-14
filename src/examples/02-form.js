import React from 'react';
import { Grid, TextField, Button, CircularProgress } from 'material-ui';
import { action, observable, reaction, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import validator from 'validate.js';

validator.validators.checkUsername = value => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (value === 'admin') resolve();
            else resolve('!== admin');
        }, 1000);
    });
};

class FormData {
    @observable username = '';
    @observable password = '';

    @observable.ref validation = null;
    @observable validating = false;

    static rules = {
        username: {
            presence: { allowEmpty: false },
            checkUsername: true,
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
            data => this.validateFields(data),
        );
    }

    @action
    setField(name, value) {
        this[name] = value;
    }

    @action
    submit() {
        const { username, password } = this;
        this.validateFields({ username, password });
    }

    async validateFields(data) {
        this.validation = null;
        this.validating = true;

        try {
            await validator.async(data, FormData.rules);
            runInAction(() => (this.validation = null));
        } catch (e) {
            this.validation = e;
        } finally {
            this.validating = false;
        }
    }
}

const formData = new FormData();

@observer
export class Form extends React.Component {
    render() {
        const { validation, validating } = formData;
        return (
            <Grid container>
                <CenteredContent>
                    <ValidatedInput
                        label={'Username'}
                        fieldName={'username'}
                        entity={formData}
                        validation={validation}
                        onChange={this.setUsername}
                    />
                </CenteredContent>

                <CenteredContent>
                    <ValidatedInput
                        type={'password'}
                        label={'Password'}
                        entity={formData}
                        onChange={this.setPassword}
                        validation={validation}
                        fieldName={'password'}
                    />
                </CenteredContent>

                <CenteredContent style={{ marginTop: '2rem' }}>
                    <Button
                        variant={'raised'}
                        onClick={this.login}
                        color={'primary'}
                        size={'large'}
                        disabled={validating}
                    >
                        Login
                        {validating ? (
                            <CircularProgress
                                color={'inherit'}
                                size={24}
                                style={{ marginLeft: 10 }}
                            />
                        ) : null}
                    </Button>
                </CenteredContent>
            </Grid>
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
    ({ label, entity, fieldName, onChange, validation, type = 'text' }) => {
        const hasError = !!(validation && validation[fieldName]);
        return (
            <TextField
                fullWidth={true}
                label={label}
                error={hasError}
                helperText={
                    hasError ? (
                        <ErrorList errors={validation[fieldName]} />
                    ) : (
                        undefined
                    )
                }
                value={entity[fieldName]}
                onChange={onChange}
                type={type}
            />
        );
    },
);

function ErrorList({ errors }) {
    return errors.map(error => (
        <span key={error} style={{ display: 'block' }}>
            {error}
        </span>
    ));
}

function CenteredContent({ children, style }) {
    return (
        <Grid container justify={'center'} style={style}>
            <Grid item xs={6} style={{ marginBottom: '1rem' }}>
                {children}
            </Grid>
        </Grid>
    );
}
