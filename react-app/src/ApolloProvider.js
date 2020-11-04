import React from 'react'
import App from './App'
import { ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client'
import { setContext } from 'apollo-link-context'
const authLink = setContext(() => {
    const token = localStorage.getItem('jwt')
    return {
        headers: {
            Authorization: token ? `Bearer ${token}` : ''
        }
    }
})
const httpLink = createHttpLink({
    uri: 'http://localhost:5000'
})

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

export default (
    <ApolloProvider client={client}>
        <App />
    </ApolloProvider>
)