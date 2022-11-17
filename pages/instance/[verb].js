import { useState } from 'react';
import Head from 'next/head'
import { get } from 'lodash';
import Color from "color";

import { useJWT, useInstance, useSolutionConnector } from '../../utils/hooks';
import SolutionTile from '../../components/SolutionTile';
import { ConfigConsumer } from '../../utils/config';


export default function UpdateInstance() {

  const [updated, setUpdated] = useState(false);
  const [error, setError] = useState(null);

  const { jwt, user, claims, isLoading: isLoadingUser } = useJWT()

  const instanceId = get(claims, 'instanceId');

  if (claims && !isLoadingUser && !instanceId) {
    throw Error('Invalid instance id')
  }

  const { instance, isLoading: isLoadingInstance, reload } = useInstance(user, instanceId);

  const { update, disconnect, enable, disable } = useSolutionConnector(user, jwt);

  const onUpdateClick = async (config) => {
    try {
      await update(instance, config)
      setUpdated(config.get('content.updateFinishedSuccessMessage'));
    } catch (e) {
      setError(e);
    }
  }

  const onDisconnectClick = async (config) => {
    try {
      await disconnect(instance)
      setUpdated(config.get('content.disconnectFinishedSuccessMessage'));
    } catch (e) {
      setError(e);
    }
  }

  const onEnableClick = async () => {
    try {
      await enable(instance, () => {
        instance.enabled = true;
        reload(instance);
      })
    } catch (e) {
      setError(e);
    }
  }

  const onDisableClick = async () => {
    try {
      await disable(instance, () => {
        instance.enabled = false;
        reload(instance);
      })
    } catch (e) {
      setError(e);
    }
  }

  console.log('instance', instance)

  const isLoading = isLoadingUser || isLoadingInstance;

  return (
    <ConfigConsumer>
      {config => (
        <div className='page'>

          <Head>
            <title>{isLoading ? 'Loading...' : `${config.get('content.modifyCTAText')} | ${instance.solution.title}`}</title>
          </Head>

          <div className='container'>
            {config.get('features.logo') ? <div className='img'><img src={config.get('images.logo')} /></div> : null}
            {isLoading ? (
              <div>
                <div className='message'>&nbsp;</div>
                <SolutionTile loading={true} />
              </div>
            ) : (
              updated ? (
                <div>
                  <div className='message'>&nbsp;</div>
                  <div className='updated'>
                    <div className='check'></div>
                    {updated}
                  </div>
                </div>
              ) : (
                <div>
                  {error ? (
                    <div className='error'>{error.message}</div>
                  ) : null}
                  <div className='message'>{get(claims, 'message', config.get('content.connectSolutionMessage'))}</div>
                  <SolutionTile
                    isInstance={true}
                    solution={instance.solution}
                    instances={[instance]}
                    onConnect={async () => await onUpdateClick(config)}
                    onDisconnect={async () => await onDisconnectClick(config)}
                    onEnable={onEnableClick}
                    onDisable={onDisableClick}
                  />
                </div>
              )
            )}
          </div>

          <style jsx>{`
              .page {
                padding: 16px;
                display: flex;
                justify-content: center;
                align-items: top;
                width: 100%;
                height: 100%;
                padding-top: 10vh;
              }

              .container {
                width: 33%;
                display: flex;
                align-items: stretch;
                flex-direction: column;
              }

              .container .img {
                text-align: center;
                width: 100%;
                margin-bottom: 16px;
              }

              .container .img img {
                max-width: ${config.get('layout.logo.maxWidth')};
                max-height: ${config.get('layout.logo.maxHeight')};
              }

              .error {
                background-color: ${config.get('color.dangerBgColor')};
                color: ${config.get('color.dangerFgColor')};
                border-radius: 4px;
                margin-bottom: 24px;
                padding: 12px;
                width: 100%;
                text-align: center;
                font-weight: 100;
                font-size: 1em;
              }

              .message {
                text-align: center;
                margin-bottom: 16px;
                font-size: 0.9em;
                color: ${Color(config.get('color.fgColor')).alpha(0.8)};
              }

              .updated {
                text-align: center;
                color: ${Color(config.get('color.fgColor')).alpha(0.8)};
                font-size: 1.2em;
                padding: 24px;
                background-color: ${config.get('color.tileBackground')};
                border-radius: 4px;
                min-height: 240px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
              }

              .updated .check {
                width: 48px;
                height: 48px;
                margin-bottom: 16px;
                vertical-align: middle;
                background-color: ${config.get('color.successBgColor')};
                -webkit-mask: url(/images/circle-check-solid.svg) no-repeat center;
                mask: url(/images/circle-check-solid.svg) no-repeat center;                
              }
          `}</style>
          <style jsx global>{`
            body, html, #__next, #__next > div {
              width: 100%;
              height: 100%;
            }
          `}</style>

        </div>
      )}
    </ConfigConsumer>
  )
}
