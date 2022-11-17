import { mutations } from '../../utils/graphql'

export default async function handler(req, res) {

  try {

    const { userToken, solutionInstanceId, enabled } = req.body;

    await mutations.toggleSolutionInstance(userToken, solutionInstanceId, enabled);

    res.status(200).json({ message: 'ok' })

  } catch (e) {
    console.error(e);
    res.status(400).json({ message: e.message })
  }
}
