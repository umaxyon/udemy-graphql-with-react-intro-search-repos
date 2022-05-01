import { gql } from '@apollo/client'

export const Me = gql`
query me {
  user(login: "umaxyon") {
    name
    avatarUrl
  }
}
`