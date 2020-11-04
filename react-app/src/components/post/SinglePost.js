import React, { useContext, useState, useRef } from 'react'
import gql from 'graphql-tag'
import { useQuery, useMutation } from '@apollo/client';
import { Card, Button, Grid, Image, Icon, Label, Form, Input } from 'semantic-ui-react';
import LikeButton from '../buttons/LikeButton';
import { AuthContext } from '../../context/auth';
import moment from 'moment';
import DeleteButton from '../buttons/DeleteButton';

const SinglePost = React.memo((props) => {
    debugger
    const postId = props.match.params.postId
    const { user } = useContext(AuthContext)
    const [comment, setComment] = useState('')
    const { data } = useQuery(FETCH_POST_QUERY, { variables: { postId: postId } })
    const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
        update() {
            setComment('')
            
        },
        variables: {
            postId,
            body: comment
        },

    })
    function deletePostCallback() {
        props.history.push('/')
    }
    let postMarkup;
    if (!data) {
        postMarkup = <p>Loading post...</p>
    } else {
        const { id, body, createdAt, username, comments, likes, likeCount, commentCount } = data.getPost
        postMarkup = (
            <Grid>
                <Grid.Row>
                    <Grid.Column width={2}>
                        <Image
                            src='https://react.semantic-ui.com/images/avatar/large/molly.png'
                            size='small'
                            float='right' />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Card fluid>
                            <Card.Content>
                                <Card.Header>{username}</Card.Header>
                                <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
                                <Card.Description>{body}</Card.Description>
                                <hr />
                                <Card.Content extra>
                                    <LikeButton user={user} post={{ id, likeCount, likes }} />
                                    <Button basic as='div' labelPosition='right' onClick={() => console.log('A')}>
                                        <Button basic color='blue'>
                                            <Icon name='comments' />
                                        </Button>
                                        <Label basic color="blue" pointing='left'>
                                            {commentCount}
                                        </Label>
                                    </Button>
                                    {user ? username === user.username ? <DeleteButton postId={id} callback={deletePostCallback} /> : null : null}
                                </Card.Content>
                            </Card.Content>
                        </Card>
                        {user && (
                            <Card fluid>
                                <Card.Content>
                                    <p>Post a comment</p>
                                    <Form>
                                        <div className='ui action input fluid'>
                                            <Input
                                                type='text'
                                                placeholder='Comment..'
                                                name='comment'
                                                value={comment}
                                                onChange={e => setComment(e.target.value)}
                                            />
                                            <button onClick={submitComment} type='submit' className='ui button teal' disabled={comment.trim() === ''}>
                                                Submit
                                        </button>
                                        </div>
                                    </Form>
                                </Card.Content>
                            </Card>
                        )}
                        {comments.map(comment => (
                            <Card fluid key={Comment.id}>
                                <Card.Content>
                                    {user && user.username === comment.username && (
                                        <DeleteButton postId={id} commentId={comment.id} />
                                    )}
                                    <Card.Header>{comment.username}</Card.Header>
                                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                                    <Card.Description>{comment.body}</Card.Description>
                                </Card.Content>
                            </Card>
                        ))}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        )
    }
    return postMarkup

})
const SUBMIT_COMMENT_MUTATION = gql`
    mutation createComment($postId: ID!, $body: String!){
        createComment(postId: $postId, body: $body) {
            id
            comments {
                id username createdAt body
            }
            commentCount
        }
    }
`
const FETCH_POST_QUERY = gql`
    query($postId: ID!){
        getPost(postId: $postId) {
            id body createdAt username likeCount
            likes{
                username
                createdAt
            }
            commentCount
            comments {
                id
                username
                createdAt
                body
            }
        }
    }
`
export default SinglePost