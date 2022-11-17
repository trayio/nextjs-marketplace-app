import jwt from 'jsonwebtoken';

import { getMasterToken, validateJsonWebToken } from '../../utils/security';
import { queries, mutations } from '../../utils/graphql'

export default async function handler(req, res) {

    try {

        const { jwt: queryJWT } = req.query;
        const masterToken = await getMasterToken(req.query);

        let { user, claims } = await validateJsonWebToken(masterToken, queryJWT);

        if (claims.expires) {
            const expires = new Date(claims.expires);
            const now = new Date();
            if (now.getTime() > expires.getTime()) {
                throw Error('Token has expired')
            }
        }

        if (!user) {
            console.log('Could not find user with id', claims.id, 'creating one')
            await mutations.createUser(claims.id, claims.name, masterToken)
            user = await queries.getUser(claims.id, masterToken);
        } else {
            // TODO: update users name from claim
        }

        const userToken = await mutations.createUserToken(user.id, masterToken);

        res.status(200).json({ user, userToken, claims })

    } catch (e) {
        console.error(e);
        res.status(400).json({ message: e.message })
    }
}
