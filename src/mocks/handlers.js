import { rest } from "msw"

// The base URL is taken from our axiosDefaults file.
const baseURL = "https://moments-django-backend.herokuapp.com/"

// Export our mock request handlers. The callback function we pass in to the rest call takes three arguments - req = request, res = response, ctx = context.
// Within the callback function, we return a JSON response, just as the real API would do.
// We got the JSON for our user details from our actual backend, but logging in via the React app to make sure the tokens were not stale, and then navigating to the dj-rest-auth/user endpoint directly, and copy and pasting the JSON.
export const handlers = [
    rest.get(`${baseURL}dj-rest-auth/user/`, (req, res, ctx) => {
        return res(ctx.json(
            {
                "pk": 1,
                "username": "andy",
                "email": "andyguttridge123@gmail.com",
                "first_name": "",
                "last_name": "",
                "profile_id": 1,
                "profile_image": "https://res.cloudinary.com/dfp40peh5/image/upload/v1/media/../default_profile_sopzfa.jpg"
            }
        ))
    }),
    // For the logout post request, we return an HTTP status 200 code to simulate a successful logout request.
    rest.post(`${baseURL}dj-rest-auth/logout/`, (req, res, ctx) =>{
        return res(ctx.status(200))
    })
]

