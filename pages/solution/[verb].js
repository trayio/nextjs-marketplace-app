import { useState } from 'react';
import Head from 'next/head'
import { get } from 'lodash';
import Color from "color"

import { useJWT, useSolution, useSolutionConnector } from '../../utils/hooks';
import SolutionTile from '../../components/SolutionTile';
import { ConfigConsumer } from '../../utils/config';


export default function ConnectSolution() {

  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);

  const { jwt, user, claims, isLoading: isLoadingUser } = useJWT()

  const solutionId = get(claims, 'solutionId');

  if (claims && !isLoadingUser && !solutionId) {
    throw Error('Invalid solution id')
  }

  const { solution, isLoading: isLoadingSolution } = useSolution(user, solutionId);

  const { connect } = useSolutionConnector(user, jwt);

  const onConnectClick = async (config) => {
    try {
      await connect(solution, config)
      setConnected(true);
    } catch (e) {
      setError(e);
    }
  }

  console.log('solution', solution)

  const isLoading = isLoadingUser || isLoadingSolution;

  return (
    <ConfigConsumer>
      {config => (
        <div className='page'>

          <Head>
            <title>{isLoading ? 'Loading...' : `${config.get('content.connectCTAText')} | ${solution.title}`}</title>
          </Head>

          <div className='container'>
            {config.get('features.logo') ? <div className='img'><img src={config.get('images.logo')} /></div> : null}
            {isLoading ? (
              <div>
                <div className='message'>&nbsp;</div>
                <SolutionTile loading={true} />
              </div>
            ) : (
              connected ? (
                <div>
                  <div className='message'>&nbsp;</div>
                  <div className='connected'>
                    <div className='check'></div>
                    {config.get('content.connectFinishedSuccessMessage')}
                  </div>
                </div>
              ) : (
                <div>
                  {error ? (
                    <div className='error'>{error.message}</div>
                  ) : null}
                  <div className='message'>{get(claims, 'message', config.get('content.connectSolutionMessage'))}</div>
                  <SolutionTile
                    solution={solution}
                    onConnect={async () => await onConnectClick(config)}
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

              .connected {
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

              .connected .check {
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
