import React, { useState } from 'react'
import { Form, Button } from 'semantic-ui-react'
import { useForm } from '../../util/hooks'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client'
import { FETCH_POSTS_QUERY } from '../../util/graphql'


const PostForm = () => {
    const [error, setErrors] = useState({})
    const { values, onChange, onSubmit } = useForm(() => createPost(), {
        body: ''
    })
    const [createPost, { err }] = useMutation(CREATE_POST_MUTATION, {
        variables: values,
        update(proxy, result) {
            const data = proxy.readQuery({
                query: FETCH_POSTS_QUERY
            })
            const newDataPosts = { ...data }
            newDataPosts.getPosts = [result.data.createPost, ...newDataPosts.getPosts]
            const newData = { ...newDataPosts }
            proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: newData })
            setErrors({})
            values.body = ''
        },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },

    })

    return (
        <>
            <Form onSubmit={onSubmit}>
                <h2>Create a post</h2>
                <Form.Field>
                    <Form.Input
                        placeholder='Hi World!'
                        name='body'
                        onChange={onChange}
                        value={values.body}
                        error={error.body && !values.body ? true : false}
                    />
                    <Button type="submit" color='teal'>
                        Submit
                    </Button>
                </Form.Field>
            </Form>
            {error.body && !values.body && (
                <div style={{marginBottom: 10}} className='ui error message'>
                    <ul className='list'>
                        <li>
                            {error.body}
                        </li>
                    </ul>
                </div>
            )}
        </>
    )
}

const CREATE_POST_MUTATION = gql`
    mutation createPost($body: String!){
        createPost(body: $body) {
            id body createdAt username
            likes { username createdAt}
            likeCount
            comments {id body username createdAt}
            commentCount
        }
    }
`
export default PostForm