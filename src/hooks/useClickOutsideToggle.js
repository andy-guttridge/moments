import React, { useEffect, useRef, useState } from 'react'

const useClickOutsideToggle = () => {

    // A prop to track whether the burger menu is currently expanded.
    const [expanded, setExpanded] = useState(false);

    // This property holds a reference to the burger icon. We use the useRef hook so that this reference is persistent.
    // We pass it as the value of the ref prop to our Navbar.Toggle component in NavBar.js, which then allows us to use this hook to reference it.
    const ref = useRef(null);
    
    // We include ref in the useEffect dependency array. I think this means the code will run whenever there is a change to the item in the dependency array.
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Here we check if the ref hook currently has a value and if so was it some other element that was clicked? If so, the user clicked outside the burger menu icon and we close the menu.
            if (ref.current && !ref.current.contains(event.target)){
                setExpanded(false);
            }
        }
        document.addEventListener('mouseup', handleClickOutside)
        // Remember - we use the return statement to return an arrow function containing our clean up code for when the component is unmounted.
        return () => {
            document.removeEventListener('mouseup', handleClickOutside)
        }
    }, [ref])
    
    //  Note we return values here, rather than a div.
  return { expanded, setExpanded, ref }
}

export default useClickOutsideToggle