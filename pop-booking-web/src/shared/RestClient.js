import {context} from "../controllers/Context";
import {D} from '../D';
import {toast} from 'react-toastify';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_HOST;


const token = req => context.token && req.set('Authorization', `Bearer ${context.token}`);
const getResponseBody = res => res.body;

const handleErrors = err => {
    if(err && !err.status){
        toast.error(D("No internet connection"));
    }

    if(err && err.response && err.response.body){
        toast.error(D(err.response.body.message));
    }
    return err;
}


export class RestClient {

    _fetch(agent) {
        return agent
            .use(token)
            .catch(handleErrors);
    }

    GET (route){
            // TODO catch errors
                // TODO add headers
                return axios.get(route);
        /*
        const req = axios.create({
                method: 'get',
                baseURL: BASE_URL,
                url: route,
                // TODO add headers
            })
            // TODO catch errors
        return req.promise;*/
    }

    POST(route, body) {
        return this._fetch(axios.post(this.getUrl(route), body));
    }

    PUT(route, body) {
        return this._fetch(axios.put(this.getUrl(route), body));
    }

    DELETE(route) {
        return this._fetch(axios.del(this.getUrl(route)));
    }
}

