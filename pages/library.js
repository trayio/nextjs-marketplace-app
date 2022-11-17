import { get } from 'lodash';

import { useJWT, useSolutions, useSolutionConnector } from '../utils/hooks';

import SolutionGrid from '../components/SolutionGrid';

export default function Library({config}) {

  const { jwt, user, claims, isLoading: isLoadingUser } = useJWT()

  const tagFilters = get(claims, 'tagFilter', []).concat(config.get('settings.tagFilter', []));

  const { solutions, isLoading: isLoadingSolutions } = useSolutions(user, [], tagFilters);

  const { connect, update, disconnect, enable, disable } = useSolutionConnector(user, jwt);

  const isLoading = !user || !solutions;

  return (
    <div className='page'>

      <SolutionGrid
        loading={isLoading}
        user={user}
        jwt={jwt}
        solutions={solutions}
        connect={connect}
        update={update}
        disconnect={disconnect}
        enable={enable}
        disable={disable}
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
