import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import NodeRSA from "node-rsa";

import { queries } from './graphql'

export async function getMasterToken(query) {

    // Check if there is a valid token passed as a query parameter

    // if (query.token) {

    //     // console.log('getMAsterToken', query.token)

    //     // Load the private key
    //     const privateKeyText = await fs.readFile(process.env.PRIVATE_KEY)
    //     const privateKey = new NodeRSA(privateKeyText.toString('utf-8'), 'openssh-private', { encryptionScheme: 'pkcs1_oaep' });

    //     return privateKey.decrypt(query.token, 'utf8');

    // }

    return process.env.MASTER_TOKEN;
}

export async function validateJsonWebToken(masterToken, jwtToDecode) {
    if (!masterToken) {
        throw Error('Expecting a valid token query parameter')
    }  

    console.log('got master token for request', masterToken)

    if (!jwtToDecode) {
        throw Error('Expecting a valid jwt query parameter')
    }        

    const claims = jwt.verify(jwtToDecode, masterToken)

    if (!claims.id) {
        throw Error('Expecting a valid `user.id` JWT claim')
    }

    if (!claims.name) {
        throw Error('Expecting a valid `user.name` JWT claim')
    }    

    console.log('getting user for id', claims.id)

    let user = await queries.getUser(claims.id, masterToken);

    console.log('queried user', user)

    return {
        user,
        claims
    };
}