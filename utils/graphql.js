import { get } from 'lodash'
import { gql, request as gqlRequest } from 'graphql-request'

const request = (token, document, variables = {}, url = (process.env.GRAPHQL_ENDPOINT || 'https://tray.io/graphql')) => {
    return gqlRequest({
      url,
      document,
      variables,
      requestHeaders: {
        'Authorization': `Bearer ${token}`
      }
    })
}

export const queries = {

    solutions: async (token = process.env.MASTER_TOKEN, tags = []) => {
        return request(token, gql`
        query solutions($tags: [String!]) {
            viewer {
              solutions(criteria: { tags: $tags}) {
                edges {
                  node {
                    id
                    title
                    description
                    tags
                    customFields {
                      key
                      value
                    }
                  }
                  cursor
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
              }
            }
          }          
        `, {
          tags
        }).then(data => get(data, 'viewer.solutions.edges'))
    },

    solutionsPaged: async (token = process.env.MASTER_TOKEN, after, count = 100) => {
        return request(token, gql`
        query solutions($count: Int!, $after: String) {
            viewer {
              solutions(first: $count, after: $after) {
                edges {
                  node {
                    id
                    title
                    description
                    tags
                    customFields {
                      key
                      value
                    }
                  }
                  cursor
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
              }
            }
          }
        `,
        {
          count,
          after
        }).then(data => ({
          solutions: get(data, 'viewer.solutions.edges'),
          pageInfo: get(data, 'viewer.solutions.pageInfo')
        }))
    },    

    solutionInstances: async (token) => {
        return request(token, gql`
        query solutionInstances {
            viewer {
              solutionInstances {
                edges {
                  node {
                    id
                    name
                    enabled
                    solution {
                      id
                      title
                      description
                      tags
                      customFields {
                        key
                        value
                      }
                    }
                    solutionVersionFlags {
                      hasNewerVersion
                      requiresUserInputToUpdateVersion
                    }
                  }
                  cursor
                }
                pageInfo {
                  hasNextPage
                  hasPreviousPage
                  startCursor
                  endCursor
                }
              }
            }
        }
        `).then(data => get(data, 'viewer.solutionInstances.edges'))
    },

    solutionInstancesPaged: async (token, after, count = 100) => {
      return request(token, gql`
      query solutionInstances($count: Int!, $after: String) {
          viewer {
            solutionInstances(first: $count, after: $after) {
              edges {
                node {
                  id
                  name
                  enabled
                  solution {
                    id
                    title
                    description
                    tags
                    customFields {
                      key
                      value
                    }
                  }
                  solutionVersionFlags {
                    hasNewerVersion
                    requiresUserInputToUpdateVersion
                  }
                }
                cursor
              }
              pageInfo {
                hasNextPage
                hasPreviousPage
                startCursor
                endCursor
              }
            }
          }
      }
      `,
      {
        count,
        after
      }).then(data => ({
        instances: get(data, 'viewer.solutionInstances.edges'),
        pageInfo: get(data, 'viewer.solutionInstances.pageInfo')
      }))
  },    

    getUser: async (externalUserId, token = process.env.MASTER_TOKEN) => {
        return request(token, gql`
        query getUser($externalUserId: String!) {
            users(criteria:{ externalUserId: $externalUserId}) {
            edges {
              node {
                id
                name
                externalUserId
              }
            }
          }
        }
        `, {
            externalUserId
        }).then(data => get(data, 'users.edges[0].node'))
    },

}

export const mutations = {

    createUser: async (externalUserId, name, token = process.env.MASTER_TOKEN) => {
        return request(token, gql`
            mutation createExternalUser($externalUserId: String!, $name: String!) {
                createExternalUser(input:{ externalUserId: $externalUserId, name: $name }) {
                    userId
                }
            }
        `, {
            externalUserId,
            name
        }).then(data => get(data, 'createExternalUser.userId'))
    },

    createUserToken: async (userId, token = process.env.MASTER_TOKEN) => {
        return request(token, gql`
            mutation authorize($userId: ID!) {
                authorize(input:{ userId: $userId }) {
                    accessToken
                }
            }
        `, {
            userId
        }).then(data => get(data, 'authorize.accessToken'))
    },

    createAuthorizationCode: async (userId, token = process.env.MASTER_TOKEN) => {
      return request(token, gql`
            mutation code($userId: ID!) {
              generateAuthorizationCode(input: {userId: $userId}) {
                authorizationCode
              }
            }
        `, {
          userId,
      }).then(data => get(data, 'generateAuthorizationCode.authorizationCode'))    
    },

    createSolutionInstance: async (userToken, solutionId, name, authValues = [], configValues = []) => {
      return request(userToken, gql`
            mutation create($solutionId: ID!, $name: String!, $authValues: [AuthValue!]!, $configValues: [ConfigValue!]!) {
              createSolutionInstance(input: {solutionId: $solutionId, instanceName: $name, authValues: $authValues, configValues: $configValues}) {
                solutionInstance {
                  id
                  name
                  enabled
                  solution {
                    id
                    title
                    description
                    tags
                    customFields {
                      key
                      value
                    }
                  }
                  solutionVersionFlags {
                    hasNewerVersion
                    requiresUserInputToUpdateVersion
                  }
                }
              }
            }
        `, {
          solutionId,
          name,
          authValues,
          configValues,
      }).then(data => get(data, 'createSolutionInstance.solutionInstance'))
    },
    
    deleteSolutionInstance: async (userToken, solutionInstanceId) => {
      return request(userToken, gql`
            mutation delete($solutionInstanceId: ID!) {
              removeSolutionInstance(input: { solutionInstanceId: $solutionInstanceId }) {
                clientMutationId
              }
            }
        `, {
          solutionInstanceId
      })
    }, 
    
    toggleSolutionInstance: async (userToken, solutionInstanceId, enabled) => {
      return request(userToken, gql`
            mutation delete($solutionInstanceId: ID!, $enabled: Boolean!) {
              updateSolutionInstance(input: { solutionInstanceId: $solutionInstanceId, enabled: $enabled }) {
                solutionInstance {
                  id
                  enabled
                }
              }
            }
        `, {
          solutionInstanceId,
          enabled
      })
    },     

}