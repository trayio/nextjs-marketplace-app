import { useRouter } from 'next/router'
import useSWRImmutable from 'swr/immutable'
import { filter, get, reduce, toLower } from 'lodash';

import { connectSolution, updateInstance, disconnectSolution, toggleInstance } from './tray';

export class ApiError extends Error {
    constructor(message, status, json) {
        super(message)
        this.name = 'ApiError2';
        this.status = status;
        this.json = json;
    }
}

const fetcher = (...args) => fetch(...args).then(async res => {
    if (res.status >= 400 && res.status <= 499) {
        const json = await res.json();
        throw new ApiError(get(json, 'message', `API Error: ${res.status}`), res.status, json);
    }
    return res.json()
})

const mutateInstances = (instances, newInstance) => {
    if (!newInstance) {
        return instances;
    }
    return (instances || []).concat([newInstance])
}

const updateSolutionsWithInstances = (solutions, instances) => {
    if (solutions && instances) {
        solutions.forEach(s => {
            s.instances = filter(instances, i => s.id === get(i, 'solution.id'))
        })        
    }
    return solutions;
}

const fixSolutionCustomFields = (solutions) => {
    if (solutions) {
        solutions.forEach(s => {
            s.customFieldsMap = reduce(get(s, 'customFields'), (curr, field) => {
                curr[toLower(field.key)] = field.value;
                return curr;
            }, {})
        })        
    }
}

const fixInstanceCustomFields = (instances) => {
    if (instances) {
        instances.forEach(i => fixSolutionCustomFields([i.solution]))
    }
}

export function useJWT() {

    // console.log('useUser', token, user)

    const router = useRouter()
    const { jwt } = router.query

    if (!jwt && router.isReady) {
        // If there is now json web token present, throw an error
        throw Error('Invalid User Session!')
      }    

    const { data, error, isValidating } = useSWRImmutable(jwt ? `/api/jwt?jwt=${encodeURIComponent(jwt)}` : null, fetcher, { shouldRetryOnError: false })

    if (error) {
        throw error;
    }    

    return {
        jwt,
        user: {
            user: get(data, 'user'),
            userToken: get(data, 'userToken'),
        },
        claims: get(data, 'claims'),
        isLoading: !error && !data,
        isValidating
    }
}

export function useSolutions(user, instances, tags = []) {

    const key = (user && user.userToken) ? `/api/solutions?token=${encodeURIComponent(user.userToken)}&tags=${tags.join(',')}` : null;
    const { data, error, isValidating, mutate } = useSWRImmutable(key, fetcher, { shouldRetryOnError: false })

    updateSolutionsWithInstances(get(data, 'solutions'), instances)

    fixSolutionCustomFields(get(data, 'solutions'))

    // console.info(data)

    if (error) {
        throw error;
    }    

    // console.log('useSolutions', user ? user.userToken : undefined, data)

    return {
        ...data,
        isLoading: !error && !data,
        isValidating,
        reload: (newInstance) => {
            mutate({solutions: updateSolutionsWithInstances(get(data, 'solutions'), mutateInstances(instances, newInstance))})
        }
    }

}

export function useSolution(user, id) {

    const key = (user && user.userToken) ? `/api/solution/${id}?token=${encodeURIComponent(user.userToken)}` : null;
    const { data, error, isValidating } = useSWRImmutable(key, fetcher, { shouldRetryOnError: false })

    if (data) {
        fixSolutionCustomFields([data])
    }  

    if (error) {
        throw error;
    }    

    // console.log('useSolutions', user ? user.userToken : undefined, data)

    return {
        solution: data,
        isLoading: !error && !data,
        isValidating,
    }

}

export function useInstances(user) {

    const key = (user && user.userToken) ? `/api/instances?token=${encodeURIComponent(user.userToken)}` : null;
    const { data, error, isValidating, mutate } = useSWRImmutable(key, fetcher, { shouldRetryOnError: false })

    // console.info(data)

    fixInstanceCustomFields(get(data, 'instances')) 

    if (error) {
        throw error;
    }

    return {
        ...data,
        isLoading: !error && !data,
        isValidating,
        reload: (newInstance) => {
            mutate({instances: mutateInstances(get(data, 'instances'), newInstance)})
        }
    }

}

export function useInstance(user, id) {

    const key = (user && user.userToken) ? `/api/instance/${id}?token=${encodeURIComponent(user.userToken)}` : null;
    const { data, error, isValidating, mutate } = useSWRImmutable(key, fetcher, { shouldRetryOnError: false })

    if (data) {
        fixInstanceCustomFields([data]) 
    }  

    if (error) {
        throw error;
    }    

    return {
        instance: data,
        isLoading: !error && !data,
        isValidating,
        reload: (updatedInstance) => {
            mutate(updatedInstance)
        }
    }

}

export function useSolutionConnector(user, jwt, globalReload) {
    return {
        connect: async (solution, config, reload) => await connectSolution(user, jwt, solution, config, reload || globalReload),
        update: async (instance, config, reload) => await updateInstance(user, jwt, instance, config, reload || globalReload),
        disconnect: async (instance, reload) => await disconnectSolution(user, instance, reload || globalReload),
        enable: async (instance, reload) => await toggleInstance(user, instance, true, reload || globalReload),
        disable: async (instance, reload) => await toggleInstance(user, instance, false, reload || globalReload)
    }
}