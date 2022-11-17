import React from "react";
import { get, times } from 'lodash'

const defaultConfig = {
    color: {
        pageBackground: '#f6f6f6',
        tileBackground: '#fff',
        fgColor: '#333',
        highlightBgColor: '#0068ed',
        highlightFgColor: '#fff',
        successBgColor: '#009e67',
        successFgColor: '#fff',            
        dangerBgColor: '#e52c37',
        dangerFgColor: '#fff',
    },
    features: {
        tags: true,
        image: true,
        tabs: true,
        logo: true,
    },
    layout: {
        grid: {
            columns: 3,
            loadingCols: 9,
            gap: "24px 24px",
        },
        image: {
            maxWidth: "100%",
            maxHeight: "96px",
            height: "96px",
        },
        logo: {
            maxWidth: '48px',
            maxHeight: '48px',
        }
    },
    settings: {
        windowMode: true,
        partnerId: 'PARTNER ID',
        wizardDomain: 'embedded.tray.io',
    },
    content: {
        connectCTAText: 'Connect',
        disconnectCTAText: 'Disconnect',
        modifyCTAText: 'Update',
        updateCTAText: 'Edit',
        libraryTitle: 'Library',
        connectionsTitle: 'My Connections',
        connectionText: 'connection',
        connectedText: 'connected',
        enableText: 'Enable',
        disableText: 'Disable',
        connectSolutionMessage: 'You have been invited to connect',
        updateSolutionMessage: 'Please update your connection below',
        connectCloseErrorMessage: 'The connection wizard was closed before it was completed',
        connectFinishedSuccessMessage: 'Connection was successfull',
        updateFinishedSuccessMessage: 'Connection was successfully updated',
        disconnectFinishedSuccessMessage: 'Connection was successfully removed'
    },
    images: {
        favicon: '/tray-mark.png',
        logo: '/tray-mark.png'
    }
};

export function getConfig(configOverrides = {}) {
    const config = Object.assign(defaultConfig, configOverrides)

    // Set some helper functions
    config.get = (path, def) => {
        return get(config, path, def);
    };
    config.fn = {
        getGridColumns: () => {
            const cols = get(config, 'layout.grid.columns');
            const colWidth = `${cols}fr`;
            return times(cols, () => colWidth).join(' ');
        }
    }   
    
    return config;
}

export const ConfigContext = React.createContext(getConfig())

export const ConfigProvider = ConfigContext.Provider;
export const ConfigConsumer = ConfigContext.Consumer;
