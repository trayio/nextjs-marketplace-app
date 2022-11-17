import { find, get, last, map } from 'lodash'

import { queries } from '../../../utils/graphql'

export default async function handler(req, res) {

  try {

    const { token: userToken, id: solutionId} = req.query;

    if (!userToken) {
      throw Error('Expecting a valid token parameter')
    }

    if (!solutionId) {
      throw Error('Expecting a valid solution id')
    }    

    let solution;

    let cursor;
    while (true) {
      const { solutions, pageInfo } = await queries.solutionsPaged(userToken, cursor);
      solution = find(solutions, s => solutionId === get(s, 'node.id'));
      if (solution) {
        break;
      }
      if (!pageInfo.hasNextPage) {
        break;
      }
      cursor = get(last(solutions), 'cursor');
    }
    
    if (!solution) {
      return res.status(404).json({ message: 'Solution not found' })
    }

    res.status(200).json(solution.node)

  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message })
  }
}
