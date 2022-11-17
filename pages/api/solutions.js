import { map } from 'lodash'

import { queries } from '../../utils/graphql'

export default async function handler(req, res) {

  try {

    const { token: userToken, tags } = req.query;

    if (!userToken) {
      throw Error('Expecting a valid token parameter')
    }

    const tagsToFilter = tags ? tags.split(',') : [];

    const solutions = await queries.solutions(userToken, tagsToFilter);

    res.status(200).json({ solutions: map(solutions, e => e.node) })

  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message })
  }
}
