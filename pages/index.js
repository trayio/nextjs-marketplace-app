import { useState, useEffect } from 'react';
import classNames from "classnames"
import Color from "color"
import { get } from 'lodash';

import { useJWT, useSolutions, useInstances, useSolutionConnector } from '../utils/hooks';
import SolutionGrid from '../components/SolutionGrid';

export default function Marketplace({ config }) {

  const [showLibrary, setShowLibrary] = useState(true);

  const { jwt, user, claims, isLoading: isLoadingUser } = useJWT()

  const tagFilters = get(claims, 'tagFilter', []).concat(config.get('settings.tagFilter', []));

  const { instances, isLoading: isLoadingInstances, reload: reloadInstances } = useInstances(user);
  const { solutions, isLoading: isLoadingSolutions, reload: reloadSolutions } = useSolutions(user, instances, tagFilters);

  useEffect(() => {
    // Reload instances if the show library flag is changed
    reloadInstances && reloadInstances();
  }, [showLibrary])

  const reload = async (newInstance) => {
    console.log('reload solutions and instances')
    reloadInstances && reloadInstances(newInstance);
    reloadSolutions && reloadSolutions(newInstance);
  }

  const { connect, update, disconnect, enable, disable } = useSolutionConnector(user, jwt, reload);


  const isLoading = !user || !solutions || !instances;


  return (
    <div className='page'>

      {config.get('features.tabs') ? (
        <ul className="tabs">
          <li className={classNames('tab', { current: showLibrary })} onClick={() => setShowLibrary(true)}>{config.get('content.libraryTitle')}</li>
          <li className={classNames('tab', { current: !showLibrary })} onClick={() => setShowLibrary(false)}>{config.get('content.connectionsTitle')} {instances ? `(${instances.length})` : null}</li>
        </ul>
      ) : null}

      <SolutionGrid
        loading={isLoading}
        user={user}
        jwt={jwt}
        solutions={showLibrary ? solutions : null}
        instances={!showLibrary ? instances : null}
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

            .tabs {
              margin: 0;
              padding: 0;
              list-style: none;
              margin-bottom: 16px;
              font-weight: 100;
              font-size: 1em;
            }

            .tab {
              display: inline-block;
              padding: 12px 16px;
              border-bottom: 2px solid ${Color(config.get('color.pageBackground')).darken(0.1)};
              cursor: pointer;
            }

            .tab:hover {
              border-color: ${Color(config.get('color.highlightBgColor')).lighten(0.5)};
            }

            .tab.current {
              font-weight: 400;
              color: ${config.get('color.highlightBgColor')};
              border-color: ${config.get('color.highlightBgColor')};
            }
        `}</style>

    </div>
  )
}
