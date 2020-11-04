import React, { useState, useContext } from 'react'
import { Form, Button, Checkbox } from 'semantic-ui-react'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import './form.css'
import { useForm } from '../util/hooks'
import { AuthContext } from '../context/auth'

const Register = React.memo((props) => {
    const context = useContext(AuthContext)
    const [errors, setErrors] = useState({})
    const { onChange, onSubmit, values } = useForm(() => addUser(), {
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    })
    const [addUser, { loading }] = useMutation(REFISTER_USER, {
        update(_, { data: { register: userData } }) {
            props.history.push('/')
            console.log(userData)
            context.login(userData)
        },
        onError(err) {
            console.log(err.graphQLErrors[0].extensions.exception.errors)
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
                    label='Email'
                    placeholder='email'
                    name='email'
                    type="text"
                    error={errors.email ? true : false}
                    value={values.email}
                    onChange={onChange}>
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
                <Form.Input
                    label='Confirm Password'
                    placeholder='confirm Password'
                    name='confirmPassword'
                    type="password"
                    error={errors.confirmPassword ? true : false}
                    value={values.confirmPassword}
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

const REFISTER_USER = gql`
    mutation register(
        $username: String!
        $email: String!
        $password: String!
        $confirmPassword: String!
    ){
        register(
            registerInput: {
                username: $username
                email: $email
                password: $password
                confirmPassword: $confirmPassword
            }
        ){
            id email username createdAt token
        }
    }
`
export default Register