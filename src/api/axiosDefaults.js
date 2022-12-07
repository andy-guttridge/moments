import axios from "axios";

axios.defaults.baseURL = 'https://moments-django-backend.herokuapp.com/';
// Multipart is required as our API is dealing with images as well as text in forms
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';
// Avoids CORS errors
axios.defaults.withCredentials = true;

// We will attach our axios interceptors to these axios instances.
export const axiosReq = axios.create();
export const axiosRes = axios.create();

