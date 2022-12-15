import React from 'react';
import { Container } from 'react-bootstrap';

import appStyles from '../../App.module.css';
import Asset from '../../components/Asset';
import { useProfileData } from '../../contexts/ProfileDataContext';
import Profile from './Profile';

const PopularProfiles = ({ mobile }) => {
    const { popularProfiles } = useProfileData();

    // Note the conditional rendering of styles based on whether the mobile prop has been passed in.
    return (
        <Container className={`${appStyles.Content}
            ${mobile && "d-lg-none text-center mb-3"}`
        }>
            {popularProfiles.results.length ? (
                <>
                    <p>Most followed profiles</p>
                    {/* If the mobile prop is present, we use slice to display only the first 4 profiles, and apply additional styling. */}
                    {mobile ? (
                        <div className="d-flex justify-content-around">
                            {popularProfiles.results.slice(0, 4).map(profile => (
                                <Profile key={profile.id} profile={profile} mobile />
                            ))}
                        </div>
                    ) : (
                        popularProfiles.results.map(profile => (
                            <Profile key={profile.id} profile={profile} />
                        ))
                    )}
                </>
            ) : (
                <Asset spinner />
            )}
        </Container>
    )
}

export default PopularProfiles