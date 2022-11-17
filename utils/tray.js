import axios from 'axios';
import { get } from 'lodash';

import { mutations } from './graphql';
import { openConfigWindow } from './window';

function openConfigWizard(url, onOpened, onCancel, window) {
    if (!window) {
        document.location.href = url;
    } else {
        const configWindow = openConfigWindow(onOpened, onCancel);

        configWindow.location = url;
    }
}

export const connectSolution = async (user, jwt, solution, config, reload) => {
    return new Promise(async (resolve, reject) => {

        const disableAutoEnable = ['yes', 'true'].indexOf(get(solution, 'customFieldsMap.disableautoenable')) != -1;

        const newInstance = await axios.post(`/api/create-instance`, {
            userToken: user.userToken,
            solutionId: solution.id,
            instanceName: `My instance of ${solution.id}`
        }).then(r => r.data).catch(e => { throw Error(`Error creating solution instance: ${get(e, 'response.data.message')}`) })
    
        // Create an auth code
        const { code: authorizationCode } = await axios.get(`/api/code`, { params: { jwt } }).then(r => r.data).catch(e => { throw Error(`Error getting authorization code: ${get(e, 'response.data.message')}`) })
    
        openConfigWizard(
            `https://${config.get('settings.wizardDomain')}/external/solutions/${config.get('settings.partnerId')}/configure/${newInstance.id}?code=${authorizationCode}`,
            async () => {
                console.log('wizard success')
                // on started, set loading etc

                if (!disableAutoEnable) {
                    // If disable auto enable is false, 
                    // we want to make an enable instance call
                    await toggleInstance(user, { id: newInstance.id }, true)
                }

                reload && reload(newInstance);
                resolve();
            },
            async () => {
                console.log('wizard error')
                // on error, delete
                await axios.post(`/api/delete-instance`, {
                    userToken: user.userToken,
                    solutionInstanceId: newInstance.id,
                }).then(r => r.data).catch(e => { throw Error(`Error cleaning up solution instance: ${get(e, 'response.data.message')}`) })
                console.log('deleted instance')
                reload && reload();
                reject(Error(config.get('content.connectCloseErrorMessage')));
            },
            config.get('settings.windowMode')
        );
    })
}

export const updateInstance = async (user, jwt, instance, config, reload) => {
    return new Promise(async (resolve, reject) => {
       
        // Create an auth code
        const { code: authorizationCode } = await axios.get(`/api/code`, { params: { jwt } }).then(r => r.data).catch(e => { throw Error(`Error getting authorization code: ${get(e, 'response.data.message')}`) })
    
        openConfigWizard(
            `https://${config.get('settings.wizardDomain')}/external/solutions/${config.get('settings.partnerId')}/configure/${instance.id}?code=${authorizationCode}`,
            async () => {
                // on started, set loading etc
                reload && reload();
                resolve();
            },
            async () => {
                resolve();
            },
            config.get('settings.windowMode')
        );
    })
}

export const disconnectSolution = async (user, instance, reload) => {
    return new Promise(async (resolve, reject) => {
        // on error, delete
        await axios.post(`/api/delete-instance`, {
            userToken: user.userToken,
            solutionInstanceId: instance.id,
        }).then(r => r.data).catch(e => { throw Error(`Error disconnecting solution instance: ${get(e, 'response.data.message')}`) })
        reload && reload();
        resolve();
    })
}

export const toggleInstance = async (user, instance, enabled, reload) => {
    return new Promise(async (resolve, reject) => {

        console.log('toggleInstance')
        // on error, delete
        await axios.post(`/api/toggle-instance`, {
            userToken: user.userToken,
            solutionInstanceId: instance.id,
            enabled,
        }).then(r => r.data).catch(e => { throw Error(`Error toggling solution instance: ${get(e, 'response.data.message')}`) })
        reload && reload();
        resolve();
    })
}
