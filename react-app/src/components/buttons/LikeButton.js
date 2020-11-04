import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import gql from 'graphql-tag'
import { Button, Icon, Label, Popup } from 'semantic-ui-react';


function LikeButton({ user, post: { id, likeCount, likes } }) {
    const [error, setErrors] = useState({})
    const [liked, setLiked] = useState(false)
    useEffect(() => {
        if (user && likes.find(like => like.username === user.username)) {
            setLiked(true)
        } else setLiked(false)
    }, [user, likes]);
    const [likePost] = useMutation(LIKE_POST_MUTATIOM, {
        variables: { postId: id },
        onError(err) {
            setErrors(err.graphQLErrors[0].extensions.exception.errors)
        },
    })
    const likeButton = user ? (
        liked ? (
            <Button color='teal' onClick={likePost}>
                <Icon name='heart' />
            </Button>
        ) : (
                <Button color='teal' basic onClick={likePost}>
                    <Icon name='heart' />
                </Button>
            )
    ) : (
            <Button as={Link} to="/login" color='teal' basic>
                <Icon name='heart' />
            </Button>
        )
    return (
        <Popup
            content='Like post'
            inverted
            trigger={
                <Button as='div' labelPosition='right' >
                    {likeButton}
                    <Label basic color='teal' pointing='left'>
                        {likeCount}
                    </Label>
                </Button>}
        />
    )
}
const LIKE_POST_MUTATIOM = gql`
    mutation likePost($postId: ID!) {
        likePost(postId: $postId) {
            id
            likes {
                username
            }
            likeCount
        }
    }`
export default LikeButton