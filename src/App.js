import React, { useState } from 'react'
import { ApolloProvider, useQuery, useMutation } from '@apollo/client'
import client from './client'
import { SEARCH_REPOSITORIES, ADD_STAR, REMOVE_STAR } from './graphql'

const PER_PAGE = 5
const DEFAULT_STATE = {
  "first": PER_PAGE,
  "after": null,
  "last":  null,
  "before": null,
  "query": "フロントエンドエンジニア"
}

const StarButton = props => {
  const { node, addStar, removeStar, state } = props
  const totalCount = node.stargazers.totalCount
  const viewerHasStarred = node.viewerHasStarred
  const starCount = totalCount === 1? "1 star": `${totalCount} stars`

  const toggleStar = !viewerHasStarred ? addStar : removeStar

  const StarStatus = () => {
    return (
      <button type="button" onClick={() => { 
        toggleStar({
          variables: {
            input: { starrableId: node.id }
          },
          update: (store, { data: { addStar, removeStar }}) => {
            const data = store.readQuery({
              query: SEARCH_REPOSITORIES,
              variables: state
            })
            const { edges } = data.search
            const { starrable } = addStar || removeStar
            const newEdges = edges.map(edge => {
              if (edge.node.id === node.id) {
                const totalCount = edge.node.stargazers.totalCount
                // const diff = viewerHasStarred ? -1: 1
                const diff = starrable.viewerHasStarred ? 1 : -1
                const newTotalCount = totalCount + diff
                return { ...edge, node: {...edge.node, stargazers: {...edge.node.stargazers, totalCount: newTotalCount }}}
              }
              return edge
            })
            const newData = { ...data, search: {...data.search, edges: newEdges } }
            store.writeQuery({ query: SEARCH_REPOSITORIES, data: newData })
            // console.log({data})
          }
        })
      }}>{starCount} | {viewerHasStarred ? 'stared': '-'}</button>
    )
  }
  return <StarStatus />
}



const Body = () => {
  const [ state, setState ] = useState(DEFAULT_STATE)
  const { loading, error, data, refetch } = useQuery(SEARCH_REPOSITORIES, { variables: state })
  const [ addStar ] = useMutation(ADD_STAR)
  const [ removeStar ] = useMutation(REMOVE_STAR)

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


  
  const render = () => {
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
                <StarButton node={node} addStar={addStar} removeStar={removeStar} state={state}/>
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
