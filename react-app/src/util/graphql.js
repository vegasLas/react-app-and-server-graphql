import gql from 'graphql-tag'
export const FETCH_POSTS_QUERY = gql`
    {
        getPosts {
            id
            body
            createdAt
            username
            comments {
                id username createdAt body
            }
            likes {
                createdAt
                username
            }
            likeCount
            commentCount
        }
    }
`
