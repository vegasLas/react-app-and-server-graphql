import React, { useState, useContext } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import './form.css'
import { useForm } from '../util/hooks'
import { AuthContext } from '../context/auth'

const Login = React.memo((props) => {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})
    const { onChange, onSubmit, values } = useForm(() => addUser(), {
        username: '',
        password: '',
    })
    const [addUser, { loading }] = useMutation(LOGIN_USER, {
        update(_, { data: { login: userData } }) {
            context.login(userData)
            console.log(userData)
            props.history.push('/')
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
        variables: values
    })

    return (
        <div className="form-container">
            <Form onSubmit={onSubmit} noValidate className={loading ? 'loading' : ''}>
                <Form.Input
                    label='Username'
                    placeholder='username'
                    name='username'
                    type="text"
                    error={errors.username ? true : false}
                    value={values.username}
                    onChange={onChange}
                >
                </Form.Input>
                <Form.Input
                    label='Password'
                    placeholder='password'
                    name='password'
                    type="password"
                    error={errors.password ? true : false}
                    value={values.password}
                    onChange={onChange}>
                </Form.Input>
                <Button type='submit' primary>Submit</Button>
            </Form>
            {Object.keys(errors).length > 0
                &&
                <div className="ui error message">
                    <ui className="list">
                        {Object.values(errors).map(value => (
                            <li key={value}>
                                {value}
                            </li>
                        ))}
                    </ui>
                </div>}
        </div>

    )
})

const LOGIN_USER = gql`
    mutation login(
        $username: String!
        $password: String!
    ){
        login(
                username: $username
                password: $password
            )
        {
            id email username createdAt token
        }
    }
`
export default Login