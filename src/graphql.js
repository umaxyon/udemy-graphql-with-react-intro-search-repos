import { gql } from '@apollo/client'

export const Me = gql`
query me {
  user(login: "umaxyon") {
    name
    avatarUrl
  }
}
`
export const SEARCH_REPOSITORIES = gql`
query searchRepo($first: Int, $after: String, $last: Int, $before: String, $query: String!) {
    search(first: $first, after: $after, last: $last, before: $before, query: $query, type: REPOSITORY) {
     repositoryCount
     pageInfo {
       endCursor
       hasNextPage
       hasPreviousPage
       startCursor
     }
     edges {
       cursor
       node {
         ... on Repository {
           id
             name
           url
           stargazers {
             totalCount
           }
           viewerHasStarred
         }
       }
     }
    }  
   }
`