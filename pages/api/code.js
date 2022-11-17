import { map } from 'lodash'
import jwt from 'jsonwebtoken';

import { getMasterToken, validateJsonWebToken } from '../../utils/security';
import { mutations } from '../../utils/graphql'

export default async function handler(req, res) {

  try {

    const { jwt: userJWT } = req.query;
    const masterToken = await getMasterToken(req.query);

    const { user, claim } = await validateJsonWebToken(masterToken, userJWT);

    if (!user) {
        throw Error('Invalid user claim')
    }

    console.log('Creating auth code for user', user)

    const code = await mutations.createAuthorizationCode(user.id);

    res.status(200).json({ code })

  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message })
  }
}
