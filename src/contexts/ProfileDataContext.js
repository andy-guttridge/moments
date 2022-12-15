import React, { createContext, useContext, useEffect, useState } from "react";

import { axiosReq } from "../api/axiosDefaults";
import { useCurrentUser } from "./CurrentUserContext";

export const ProfileDataContext = createContext();
export const SetProfileDataContext = createContext();

export const useProfileData = () => useContext(ProfileDataContext);
export const useSetProfileData = () => useContext(SetProfileDataContext);


export const ProfileDataProvider = ( {children} ) => {
    const [profileData, setProfileData] = useState({
        pageProfie: { results: [] },
        popularProfiles: { results: [] },
    })

    const currentUser = useCurrentUser();
    
    // Note the dependency array for our useEffect hook contains the current user.
    useEffect(() => {
        const handleMount = async () => {
            try {
                const {data} = await axiosReq.get(
                    '/profiles/?ordering=-followers_count'
                );
                setProfileData((prevState) => ({
                    ...prevState,
                    popularProfiles: data,
                }));
            }
            catch(err) {
                console.log(err);
            };
        }
        handleMount();
    }, [currentUser]);

    return (
        <ProfileDataContext.Provider value={profileData}>
            <SetProfileDataContext.Provider value={setProfileData}>
                {children}
            </SetProfileDataContext.Provider>
        </ProfileDataContext.Provider>
    )
}