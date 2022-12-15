import axios from "axios";
import { useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"

export const useRedirect = (userAuthStatus) => {
    const history = useHistory();

    useEffect(() => {
        const handleMount = async () => {
            // We can use the following post request to check if the user is authenticated. If they are, the code under the request in the try block will run.
            // If they aren't, then the code in the catch block runs instead. So we can pass in loggedIn or loggedOut to this hook to tell it the circumstances in which we want to redirect.
            try {
                await axios.post('dj-rest-auth/token/refresh/')
                if (userAuthStatus === 'loggedIn'){
                    history.push('/')
                }
            }
            catch(err) {
                if (userAuthStatus === 'loggedOut'){
                    history.push('/')
                }
            }
        }
        handleMount();
    },[history, userAuthStatus])
}