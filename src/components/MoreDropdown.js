import React from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import styles from '../styles/MoreDropdown.module.css'

// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu

// We removed the children prop and href attribute from the boiler plate code. We changed the default <a> tag to an <i> tag. We extensively re-tooled the default code - too much so to document here.
// Note that forward ref is used for passing refs through a component to one of its children. This is necessary because ref is a 'special' prop, treated differently than normal props by Bootstrap.
const ThreeDots = React.forwardRef(({ onClick }, ref) => (
    <i
        className="fas fa-ellipsis-v"
        ref={ref}
        onClick={(e) => {
            e.preventDefault();
            onClick(e);
        }}
    />
));

export const MoreDropdown = ({handleEdit, handleDelete}) => {
    return (
        <Dropdown className="ml-auto" drop="left">
            <Dropdown.Toggle as={ThreeDots} />
            <Dropdown.Menu className="text-center" popperConfig={{strategy: "fixed"}}>
                <Dropdown.Item className={styles.DropdownItem}
                    onClick={handleEdit}
                    aria-label="edit"
                >
                    <i className="fas fa-edit" />
                </Dropdown.Item>
                <Dropdown.Item
                    className={styles.DropdownItem}
                    onClick={handleDelete}
                    aria-label="delete"
                >
                    <i className="fas fa-trash-alt" />
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}