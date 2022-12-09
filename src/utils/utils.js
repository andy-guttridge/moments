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
