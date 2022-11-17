import '../styles/globals.css'

import Head from 'next/head'

import ErrorBoundary from '../components/ErrorBoundary';
import { getConfig, ConfigProvider } from '../utils/config'

function MyApp({ Component, pageProps }) {

  const config = getConfig();

  return (
    <ConfigProvider value={config}>
      <ErrorBoundary config={config}>
        <div>
          <Head>
            <title>Integration Marketplace</title>
            <meta name="description" content="Integration Marketplace" />
            <link rel="icon" href={config.get('images.favicon')} />
          </Head>

          <Component config={config} {...pageProps} />

        </div>
      </ErrorBoundary>
      <style jsx global>{`
        body {
          background-color: ${config.get('color.pageBackground')};
        }
      `}</style>
    </ConfigProvider>
  )
}

export default MyApp
