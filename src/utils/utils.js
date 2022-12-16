import jwtDecode from "jwt-decode"
import { axiosReq } from "../api/axiosDefaults"

export const fetchMoreData = async (resource, setResource) => {
    try {
        //  Get the next page of resources using the url provided by the API.
        const {data} = await axiosReq.get(resource.next)
        // Set the resource prop of the parent first using the existing data, then set the next key with the url for the next page of data from the API.
        setResource(prevResource => ({
            ...prevResource,
            next: data.next,
            // Use the reduce method to go through the next page of results from the API. The  some  method compares each post we are already displaying with the 
            // posts returned by the API. If there is a match we are displaying it already, and we return the accumlated array as is. If not, then we are not displaying this post and we add it to the array.
            // Note the initial value is prevResource.results, i.e. the array of results already being displayed. The reason for all this is to deal with situations where  new posts might be added or deleted by other users all the time. See lesson notes.
            results: data.results.reduce((acc, cur) => {
                return acc.some((accResult) => accResult.id === cur.id)
                ? acc
                : [...acc, cur]
            }, prevResource.results)
        }))
    }
    catch (err){

    }
}

export const followHelper = (profile,  clickedProfile, following_id) => {
    return profile.id === clickedProfile.id
    ? // The profile that has been clicked on - we update its followers count and set the following id
        {
            ...profile,
            followers_count: profile.followers_count + 1,
            following_id
        }
    : profile.is_owner
    ? // In the case this is the profile of the logged in user, update its following count
        { ...profile, following_count: profile.following_count + 1 }
    : // Otherwise, this is not the profile the user clicked on or user's own profile, so return it unchanged
        profile;
}

export const unfollowHelper = (profile, clickedProfile) => {
    return profile.id === clickedProfile.id
    ? // The profile that has been clicked on - we update its followers count and set the following id
        {
            ...profile,
            followers_count: profile.followers_count - 1,
            following_id: null,
        }
    : profile.is_owner
    ? // In the case this is the profile of the logged in user, update its following count
        { ...profile, following_count: profile.following_count - 1 }
    : // Otherwise, this is not the profile the user clicked on or user's own profile, so return it unchanged
        profile;
}

// This function excepts the data object returned by the API when the user logs in.
export const setTokenTimestamp = (data) => {
    // We use the jwtDecode function to decode the refresh token. The token expiry date is returned with a key of exp.
    const refreshTokenTimestamp = jwtDecode(data?.refresh_token).exp;
    localStorage.setItem("refreshTokenTimestamp", refreshTokenTimestamp);
}

// This function determines whether the token needs to be refreshed on the basis of whether the user is logged in, and returns a boolean.
export const shouldRefreshToken = () => {
    // The double not operator ensure the token will only be refreshed for a logged in user.
    return !!localStorage.getItem('refreshTokenTimestamp');
}

// This function removes the details of the token from local storage.
export const removeTokenTimestamp = () => {
    localStorage.removeItem('refreshTokenTimestamp');
}
