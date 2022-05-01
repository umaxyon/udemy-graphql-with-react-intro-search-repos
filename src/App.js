import React, { useEffect, useState } from 'react'
import { ApolloProvider, useQuery } from '@apollo/client'
import client from './client'
import { SEARCH_REPOSITORIES } from './graphql'

const VARIABLES = {
  "first": 5,
  "after": null,
  "last":  null,
  "before": null,
  "query": "フロントエンドエンジニア"
}

const Body = () => {
  const [state, setState] = useState({})
  const { loading, error, data } = useQuery(SEARCH_REPOSITORIES, { variables: state })
  useEffect(() => {
    setState(VARIABLES)
  },[])

  const { query, first, last, before, after } = state

  console.log(data)

  return (
    <div>
    {
      (loading) ? ( 'Loading...' 
      ) : (error) ? (
        `Error! ${error.message}`
      ) : (
        <></>
      )
    }
    </div>
  )
}


function App() {
  
  return (
    <ApolloProvider client={client}>
      <Body />
    </ApolloProvider>
  );
}

export default App
