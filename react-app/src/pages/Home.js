import React, { useContext } from 'react'
import { useQuery } from '@apollo/client'
import { Grid, Transition } from 'semantic-ui-react'
import PostCard from '../components/post/PostCard'
import './home.css'
import { AuthContext } from '../context/auth'
import PostForm from '../components/post/PostForm'
import { FETCH_POSTS_QUERY } from '../util/graphql'

const Home = () => {
    const { loading, data } = useQuery(FETCH_POSTS_QUERY)
    const { user } = useContext(AuthContext)
    return (
        <Grid columns={3} divided>
            <Grid.Row className="page-title">
                <h1>Recent Posts</h1>
            </Grid.Row>
            <Grid.Row>
                {user && (
                    <Grid.Column>
                        <PostForm />
                    </Grid.Column>
                )}
                {loading ? (
                    <h2>Loading Posts...</h2>
                ) : (
                        <Transition.Group>
                            {
                                data.getPosts && data.getPosts.map(post => (
                                    <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                                        <PostCard post={post} />
                                    </Grid.Column>
                                ))
                            }
                        </Transition.Group>
                    )}
            </Grid.Row>
        </Grid >
    )
}



export default Home