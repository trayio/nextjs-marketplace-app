import { get } from 'lodash';

import { useJWT, useSolutions, useInstances, useSolutionConnector } from '../utils/hooks';

import SolutionGrid from '../components/SolutionGrid';

export default function Connections({config}) {

  const { jwt, user, claims, isLoading: isLoadingUser } = useJWT()

  const tagFilters = get(claims, 'tagFilter', []).concat(config.get('settings.tagFilter', []));

  const { instances, isLoading: isLoadingInstances } = useInstances(user);

  const { connect, update, disconnect } = useSolutionConnector(user, jwt);

  const isLoading = !user || !instances;

  return (
    <div className='page'>

      <SolutionGrid
        loading={isLoading}
        user={user}
        jwt={jwt}
        instances={instances}
        connect={connect}
        update={update}
        disconnect={disconnect}
        tagFilters={tagFilters}
      />

      <style jsx>{`
          .page {
            padding: 16px;
          }
      `}</style>

    </div>
  )
}
