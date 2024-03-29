import { useState, useEffect, createContext, useContext, useMemo } from 'react';
import axios from 'axios';

import { useHistory } from 'react-router-dom';
import { removeTokenTimestamp, shouldRefreshToken } from '../utils/utils';
import { axiosReq, axiosRes } from '../api/axiosDefaults';

// Here we use the React createContext function to create context objects that we can export for reference in other components.
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

// We we create custom hooks we can call in other components to actually access the context objects we've created, via the useContext hook.
export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// Note this component has a different name to the file. This is where we create the provider component that our children are wrapped in within index.js.
// We destructure the children which are passed in.
export const CurrentUserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const history = useHistory();
    
    // We handle our network request to check whether the user is authenticated when the component mounts.
    const handleMount = async () => {
        try {
            // Here we destructure the data property in place. Note we're using our axios response interceptor to make the request. 
            const {data} = await axiosRes.get('dj-rest-auth/user/');
            // Set the current user with the data we get back.
            setCurrentUser(data);
        }
        catch(err){
            // console.log(err);
        }
    }
    
    // Here we pass useEffect() an empty dependency array, so it only runs when the component is first mounted.
    useEffect(() => {
        handleMount()
    }, [])
    
    // Use memo runs before any child components are mounted. Note we pass it our history const defined above, as we only want it to run once, but it won't accept an empty array.
    useMemo(() => {
        // Create a request interceptor using one of the axios instances we've exported from axiosDefaults.js
        axiosReq.interceptors.request.use(
            // Inside the try...catch block, we try to refresh the token. 
            // If this fails, the refresh token has expired, so they are re-directed to the sign-in page and the user set to null.
            // The request config is returned both inside and outside the catch block.
            // Note we use our shouldRefreshToken function to find out whether details of a refresh token are in local storage. If not, the user isn't authenticated so don't bother request to refresh the token.
            async (config) => {
                if (shouldRefreshToken()){
                    try {
                        await axios.post('/dj-rest-auth/token/refresh/')
                    }
                    catch(err){
                        setCurrentUser((prevCurrentUser) => {
                            if(prevCurrentUser) {
                                history.push('/signin')
                            }
                            return null
                        });
                        // Remove the token time stamp from local storage when the user is logged out.
                        removeTokenTimestamp();
                        return config
                    }
                }
                return config
            },
            (err) => {
                return Promise.reject(err)
            }
        )
        // Create a response interceptor using one of the axios instances we've exported from axiosDefaults.js
        axiosRes.interceptors.response.use(
            // If there is no error, we simply return the response.
            // If there is an error, we check if it is 401 unauthorised.
            // Then inside the try...catch block, we attempt to refresh the token. If that fails, we check if the user was previously logged in and if so redirect to the sign in page. We set the current user to null.
            // If the error wasn't 401
            (response) => response,
            async (err) => {
                if (err.response?.status === 401){
                    try {
                        await axios.post('dj-rest-auth/token/refresh/')
                    }
                    catch(err){
                        setCurrentUser((prevCurrentUser) => {
                            if(prevCurrentUser){
                                history.push('/signin')
                            }
                            return null
                        });
                        // Remove the token time stamp from local storage when the user is logged out.
                        removeTokenTimestamp();
                        // Return the error details to exit the interceptor from the catch block.
                        return axios(err.config)
                    }
                    // If the error wasn't 401, reject the promise with the error to exit the interceptor.
                    return Promise.reject(err)
                }
            }
        )
    }, [history]);

    return (
        // Here we use the context objects we created and exported above to make Provider components available to child components.
        // These accept a value which can be accessed in the children which are subscribed to these contexts.
      <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUserContext.Provider>
      </CurrentUserContext.Provider>
    )
}