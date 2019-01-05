import React, { CSSProperties, FunctionComponent } from 'react';
import { Button, CircularProgress, Grid, TextField } from '@material-ui/core';
import { action, observable, reaction, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import validator from 'validate.js';
// import { configure } from 'mobx';

// configure({ enforceActions: 'always' });

validator.validators.checkUsername = (value: string) => {
    return new Promise(resolve => {
        setTimeout(() => {
            if (value === 'admin') {
                resolve();
            } else {
                resolve('!== admin');
            }
        }, 1000);
    });
};

class FormData {
    public static rules = {
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
    @observable
    public username = '';

    @observable
    public password = '';

    @observable.ref
    public validation = null;

    @observable
    public validating = false;

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
    public setField(name: string, value: string) {
        this[name] = value;
    }

    @action
    public submit() {
        const { username, password } = this;
        this.validateFields({ username, password });
    }

    public async validateFields(data: { username: string; password?: string }) {
        this.validation = null;
        this.validating = true;

        try {
            await validator.async(data, FormData.rules);
            runInAction(() => (this.validation = null));
        } catch (e) {
            runInAction(() => {
                this.validation = e;
            });
        } finally {
            runInAction(() => {
                this.validating = false;
            });
        }
    }
}

const formData = new FormData();

@observer
export class Form extends React.Component {
    public render() {
        const { validation, validating } = formData;
        return (
            <Grid container={true}>
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

    public setUsername = (event: React.FormEvent<HTMLInputElement>) => {
        formData.setField('username', event.currentTarget.value);
    };

    public setPassword = (event: React.FormEvent<HTMLInputElement>) => {
        formData.setField('password', event.currentTarget.value);
    };

    public login = () => {
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

interface ErrorListProps {
    errors: any[];
}
const ErrorList: FunctionComponent<ErrorListProps> = ({ errors }) => {
    return (
        <div>
            {errors.map(error => (
                <span key={error} style={{ display: 'block' }}>
                    {error}
                </span>
            ))}
        </div>
    );
};

const CenteredContent = ({
    children,
    style,
}: {
    children: React.ReactNode;
    style?: CSSProperties;
}) => {
    return (
        <Grid container={true} justify={'center'} style={style}>
            <Grid item={true} xs={6} style={{ marginBottom: '1rem' }}>
                {children}
            </Grid>
        </Grid>
    );
};
