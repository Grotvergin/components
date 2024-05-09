import axios, { AxiosError } from 'axios';

// Type guard with "type predicate"
function isAxiosError(candidate: unknown): candidate is AxiosError {
    if (
        candidate &&
        typeof candidate === 'object' &&
        'isAxiosError' in candidate
    ) {
        return true;
    }
    return false;
}

export async function UpdatePostData(url: string, bodyParams: Record<string, any> | Record<string, any>[]): Promise<any> {
    try {
        const response = await axios.put(url, bodyParams);
        console.log("ApiTS Update -> BodyParams: ", bodyParams)
        console.log("ApiTS -> Response: ", response.data)
        return response.data;
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            if (error.response) {
                return ['Error', error.response.data];
            } else if (error.request) {
                return ['Error', error.request];
            } else {
                return ['Error', error.message];
            }
        }
        else {
            return ['Error', error];
        }
    }
}

export async function fetchPostData(url: string, bodyParams: Record<string, any> | Record<string, any>[]): Promise<any> {
    try {
        const response = await axios.post(url, bodyParams);
        return response.data;
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            if (error.response) {
                return ['Error', error.response.data];
            } else if (error.request) {
                return ['Error', error.request];
            } else {
                return ['Error', error.message];
            }
        }
        else {
            return ['Error', error];
        }
    }
}

export async function fetchData(url: string): Promise<any> {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error: unknown) {
        if (isAxiosError(error)) {
            if (error.response) {
                return ['Error', error.response.data];
            } else if (error.request) {
                return ['Error', error.request];
            } else {
                return ['Error', error.message];
            }
        }
        else {
            return ['Error', error];
        }

    }
}

declare global {

    interface AppEnv {
        SERVICE_URL: string,
    }

    interface Window {
        _env_: AppEnv | any
    }
}

//INFO: Values used for local development with mts k8s
const defaultEnv = {
    SERVICE_URL: '/api',
}

function getEnvParameter<T>(key: string, defaultValue: T): T | null {
    if (Object.prototype.hasOwnProperty.call(window._env_, key)) {
        var val = window._env_[key];
        return val as T
    }

    return defaultValue ? defaultValue : null;
}

export const getServiceUrl = () => {
    const retVal = getEnvParameter<string>('SERVICE_URL', defaultEnv.SERVICE_URL)
    return retVal
}

class Api {
    SERVICE_URL = getServiceUrl() ? getServiceUrl() as string : '/service_url_is_undefined';

    constructor() {
    }

    getComponents = async (name: string) => {
        return await fetchData(`${this.SERVICE_URL}/components/${name}`)
    }

    addComponent = async (name: string, params: string, result: string) => {
        // try {
        //     this.getComponents(name).then((response: any) => {
        //         if(response?.data.length !== 0) {
        //             return UpdatePostData(`${this.SERVICE_URL}/component`, {
        //                 name: name,
        //                 params: params,
        //                 result: result
        //             })
        //         }
        //         return fetchPostData(`${this.SERVICE_URL}/component`, {
        //             name: name,
        //             params: params,
        //             result: result
        //         })
        //     })
        // } catch (error: unknown) {
        //     console.log("Something went wrong")
        // }
        return await fetchPostData(`${this.SERVICE_URL}/component`, {
            name: name,
            params: params,
            result: result
        })
    }

    calculateVoltAmpere = async (Vf: number[], If: number[]) => {
        return await fetchPostData(`${this.SERVICE_URL}/calc/va`, {
            Vf: Vf,
            If: If,
        })
    }

    calculateVoltCapacitance = async (C: number[], Vr: number[]) => {
        return await fetchPostData(`${this.SERVICE_URL}/calc/vc`, {
            C: C,
            Vr: Vr,
        })
    }

    calculateReverseRecoveryTime = async (Trr: number[], Ir: number[]) => {
        return await fetchPostData(`${this.SERVICE_URL}/calc/rrt`, {
            Trr: Trr,
            Ir: Ir,
        })
    }

    calculateTempratureСoefficient = async (Temp: number[], It: number[]) => {
        return await fetchPostData(`${this.SERVICE_URL}/calc/tc`, {
            Temp: Temp,
            It: It,
        })
    }
}

export default Api