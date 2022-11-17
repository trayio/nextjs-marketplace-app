import { find, get, last, map } from 'lodash'

import { queries } from '../../../utils/graphql'

export default async function handler(req, res) {

  try {

    const { token: userToken, id: instanceId} = req.query;

    if (!userToken) {
      throw Error('Expecting a valid token parameter')
    }

    if (!instanceId) {
      throw Error('Expecting a valid instance id')
    }    

    let instance;

    let cursor;
    while (true) {
      const { instances, pageInfo } = await queries.solutionInstancesPaged(userToken, cursor);
      instance = find(instances, s => instanceId === get(s, 'node.id'));
      if (instance) {
        break;
      }
      if (!pageInfo.hasNextPage) {
        break;
      }
      cursor = get(last(instances), 'cursor');
    }
    
    if (!instance) {
      return res.status(404).json({ message: 'Instance not found' })
    }

    res.status(200).json(instance.node)

  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message })
  }
}
