import React from 'react'
import { ApolloProvider, gql, useQuery } from '@apollo/client'
import client from './client'

const Me = gql`
query me {
  user(login: "umaxyon") {
    name
    avatarUrl
  }
}
`

const Body = () => {
  const { loading, error, data } = useQuery(Me)
  return (
    <div>
    {
      (loading) ? ( 'Loading...' 
      ) : (error) ? (
        `Error! ${error.message}`
      ) : (
        data.user.name
      )
    }
    </div>
  )
}


function App() {
  
  return (
    <ApolloProvider client={client}>
      <div>Hello GraphQL </div>
      <Body />
    </ApolloProvider>
  );
}

export default App
