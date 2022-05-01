import { ApolloClient, InMemoryCache, ApolloLink, HttpLink } from '@apollo/client'


const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;

const headerslink = new ApolloLink(( operation, forward ) => {
    operation.setContext({
        headers: {
            Authorization: `Bearer ${GITHUB_TOKEN}`
        }
    })
    return forward(operation)
})

const endpoint = 'https://api.github.com/graphql'
const httpLink = new HttpLink({ 
    uri: endpoint
})
const link = ApolloLink.from([headerslink, httpLink ])

export default new ApolloClient({
    link,
    cache: new InMemoryCache()
})

console.log({GITHUB_TOKEN});