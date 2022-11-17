import { map } from 'lodash'

import { queries } from '../../utils/graphql'

export default async function handler(req, res) {

  try {

    const { token: userToken } = req.query;

    if (!userToken) {
      throw Error('Expecting a valid token parameter')
    }

    const solutionInstances = await queries.solutionInstances(userToken);

    res.status(200).json({ instances: map(solutionInstances, e => e.node) })

  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message })
  }
}
