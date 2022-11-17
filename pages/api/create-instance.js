import { mutations } from '../../utils/graphql'

export default async function handler(req, res) {

  try {

    const { userToken, solutionId, instanceName, authValues, configValues } = req.body;

    const instance = await mutations.createSolutionInstance(userToken, solutionId, instanceName, authValues, configValues);

    res.status(200).json(instance)

  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message })
  }
}
