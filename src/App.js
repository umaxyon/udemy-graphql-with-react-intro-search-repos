import React, { useState } from 'react'
import { ApolloProvider, useQuery } from '@apollo/client'
import client from './client'
import { SEARCH_REPOSITORIES } from './graphql'

const PER_PAGE = 5
const DEFAULT_STATE = {
  "first": PER_PAGE,
  "after": null,
  "last":  null,
  "before": null,
  "query": "フロントエンドエンジニア"
}

const StarButton = props => {
  const { node } = props
  const totalCount = node.stargazers.totalCount
  const viewerHasStarred = node.viewerHasStarred
  const starCount = totalCount === 1? "1 star": `${totalCount} stars`
  return (
    <button>{starCount} | {viewerHasStarred ? 'stared': '-'}</button>
  )
}



const Body = () => {
  const [ state, setState ] = useState(DEFAULT_STATE)
  const { loading, error, data } = useQuery(SEARCH_REPOSITORIES, { variables: state })

  const { query } = state

  const handleChange = (e) => {
    setState({
      ...DEFAULT_STATE, query: e.target.value
    })
  }
  const goNext = (search) => {
    setState({
      ...state,
      first: PER_PAGE, after: search.pageInfo.endCursor,
      last: null, before: null
    })
  }
  const goPrevious = (search) => {
    setState({
      ...state,
      first: null, after: null,
      last: PER_PAGE, before: search.pageInfo.startCursor
    })
  }


  console.log({query})
  
  const render = () => {
    console.log(data.search)
    const search = data.search;
    const repositoryCount = search.repositoryCount;
    const repositoryUnit = repositoryCount === 1 ? 'Repository' : 'Repositories'
    const title = <h2>GitHub Repositories Search Results - {data.search.repositoryCount} {repositoryUnit}</h2>
    return (
      <>
        {title}
        <ul>
          {search.edges.map(edge => {
            const { node } = edge;
            return (
              <li key={node.id}>
                <a href={node.url} target="_blank" rel="noopener noreferrer">{node.name}</a> &nbsp;
                <StarButton node={node} />
              </li>
            )
          })}
        </ul>
        {search.pageInfo.hasPreviousPage ? <button onClick={() => goPrevious(search)}>Previous</button> : null}
        {search.pageInfo.hasNextPage ? <button onClick={() => goNext(search)}>Next</button> : null}
        
      </>
      
    )
  }
  return (
    <form>
      <input value={query || ""} onChange={handleChange} />
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
