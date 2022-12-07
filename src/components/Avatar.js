import React from 'react'
import styles from '../styles/Avatar.module.css'

// Our Avatar component takes some props.
// src is the image URL, height the height and text the text to display with the Avatar.
// Note the use of a default value for height, and how we destructure the props in place.
const Avatar = ({ src, height = 45, text}) => {

  return (
    <span>
        {/* Create an image element based on the props, and display the text value under the image. */}
        <img className={styles.Avatar} src={src} height={height} width={height} alt="avatar" />
        {text}
    </span>
  )
}

export default Avatar