import React, { useState } from 'react'
import gql from 'graphql-tag'
import { useMutation } from '@apollo/client';
import { Button, Icon, Confirm, Popup } from 'semantic-ui-react';
import { FETCH_POSTS_QUERY } from '../../util/graphql';
const DeleteButton = React.memo(({ postId, commentId, callback }) => {
    const deleteCallBack = () => {
        debugger
        callback()
    }
    const [confirmOpen, setConfirmOpen] = useState(false)
    const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION
    const [deletePostOrMetation] = useMutation(mutation, {
        update(proxy, result) {
            setConfirmOpen(false)
            if (!commentId) {
                const data = proxy.readQuery({ query: FETCH_POSTS_QUERY })
                const newDataPosts = { ...data }
                newDataPosts.getPosts = newDataPosts.getPosts.filter(p => p.id !== postId)
                const newData = { ...newDataPosts }
                proxy.writeQuery({ query: FETCH_POSTS_QUERY, data: newData })
            }
            if (callback) {
                debugger
                deleteCallBack()
            }
        },
        onError(err) {
            console.log(err)
        },
        variables: {
            postId,
            commentId
        }
    })
    return (
        <>
            <Popup
                content={commentId ? 'Delete comment' : 'Delete post'}
                inverted
                trigger={
                    <Button
                        as='div'
                        color='red'
                        floated='right'
                        onClick={() => setConfirmOpen(true)}>
                        <Icon name='trash' style={{ margin: 0 }} />
                    </Button>
                }
            />
            <Confirm
                open={confirmOpen}
                onCancel={() => setConfirmOpen(false)}
                onConfirm={deletePostOrMetation}
            />
        </>
    )
})
const DELETE_POST_MUTATION = gql`
    mutation deletePost($postId: ID!){
        deletePost(postId: $postId) 
    }
`
const DELETE_COMMENT_MUTATION = gql`
    mutation deleteComment($postId: ID!, $commentId: ID!){
        deleteComment(postId: $postId, commentId: $commentId) {
            id
            comments {
                id username createdAt body
            }
            commentCount
        }
    }
`
export default DeleteButton