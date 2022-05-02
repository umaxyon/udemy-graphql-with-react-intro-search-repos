import React, { useEffect, useState } from 'react'
import { ApolloProvider, useQuery } from '@apollo/client'
import client from './client'
import { SEARCH_REPOSITORIES } from './graphql'

const DEFAULT_STATE = {
  "first": 5,
  "after": null,
  "last":  null,
  "before": null,
  "query": "フロントエンドエンジニア"
}

const Body = () => {
  const [state, setState] = useState(DEFAULT_STATE)
  const { loading, error, data } = useQuery(SEARCH_REPOSITORIES, { variables: state })

  const { query, first, last, before, after } = state

  const handleChange = (e) => {
    setState({
      ...DEFAULT_STATE, query: e.target.value
    })
  }

  console.log({query})
  if (!loading && !error) console.log(data.search)
  
  const render = () => {
    const search = data.search;
    const repositoryCount = search.repositoryCount;
    const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories'
    const title = <h2>GitHub Repositories Search Results - {data.search.repositoryCount} {repositoryUnit}</h2>
    return title
  }
  return (
    <form>
      <input value={query} onChange={handleChange} />
    {
      (loading) ? (
        'Loading...' 
      ) : (error) ? (
        `Error! ${error.message}`
      ) : (
        render()
      )
    }
    </form>
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
