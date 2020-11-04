import React, { useContext } from 'react'
import { Card, Icon, Label, Image, Button, Popup } from 'semantic-ui-react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { AuthContext } from '../../context/auth'
import LikeButton from '../buttons/LikeButton'
import DeleteButton from '../buttons/DeleteButton'

const PostCard = ({ post }) => {
    const { body, createdAt, id, username, likeCount, commentCount, likes } = post
    const { user } = useContext(AuthContext)
    return (
        <Card>
            <Card.Content>
                <Image
                    floated='right'
                    size='mini'
                    src='https://react.semantic-ui.com/images/avatar/large/elliot.jpg'
                />
                <Card.Header>{username}</Card.Header>
                <Card.Meta as={Link} to={`/posts.${id}`}>{moment(createdAt).fromNow(true)}</Card.Meta>
                <Card.Description>{body}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <LikeButton user={user} post={{ id, likeCount, likes }} />
                <Popup
                    content='Comment on post'
                    inverted
                    trigger={<Button as='div' labelPosition='right' as={Link} to={`/posts/${id}`}>
                        <Button color='teal' basic>
                            <Icon name='comments' />
                        </Button>
                        <Label basic color='teal' pointing='left'>
                            {commentCount}
                        </Label>
                    </Button>}
                />
                {user && user.username === username && <DeleteButton postId={id} />}
            </Card.Content>
        </Card>
    )
}
export default PostCard