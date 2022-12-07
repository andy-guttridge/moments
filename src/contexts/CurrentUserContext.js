import { useState, useEffect, createContext, useContext } from 'react';
import axios from 'axios';

// Here we use the React createContext function to create context objects that we can export for reference in other components.
export const CurrentUserContext = createContext();
export const SetCurrentUserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUserContext);

// Note this component has a different name to the file.
export const CurrentUserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    
    // We handle our network request to check whether the user is authenticated when the component mounts.
    const handleMount = async () => {
        try {
            // Here we destructure the data property in place.
            const {data} = await axios.get('dj-rest-auth/user/');
            // Set the current user with the data we get back.
            setCurrentUser(data);
        }
        catch(err){
            console.log(err)
        }
    }
    
    // Here we pass useEffect() an empty dependency array, so it only runs when the component is first mounted.
    useEffect(() => {
        handleMount()
    }, [])

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