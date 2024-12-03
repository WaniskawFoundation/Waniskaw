import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { remSize } from '../../theme';
import DropdownMenu from './DropdownMenu';

const KebabIcon = styled.div`
  display: flex; /* Makes it a flex container */
  flex-direction: column; /* Aligns the dots vertically */
  align-items: center; /* Centers the dots horizontally */
  justify-content: center; /* Centers the dots vertically */
  width: ${remSize(20)}; /* Sets the width of the icon */
  height: ${remSize(20)}; /* Sets the height of the icon */
  margin: 0 auto; /* Centers the icon horizontally in its container */

  & div {
    width: ${remSize(3)}; /* Width of each dot */
    height: ${remSize(3)}; /* Height of each dot */
    background-color: white; /* Dot color */
    border-radius: 50%; /* Makes the dots circular */
    margin: ${remSize(1)} 0; /* Spacing between dots */
  }
`;

const TableDropdownIcon = React.forwardRef((props, ref) => (
  <button
    ref={ref}
    {...props}
    style={{
      background: 'none',
      border: 'none',
      padding: 0,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%'
    }}
  >
    <KebabIcon>
      <div />
      <div />
      <div />
    </KebabIcon>
  </button>
));

const TableDropdownWrapper = styled.div`
  position: relative; /* Required to position the dropdown relative to this container */
`;

const TableDropdown = ({ children, ...props }) => {
  const anchorRef = useRef(null);

  return (
    <TableDropdownWrapper>
      <DropdownMenu
        align="right"
        anchor={<TableDropdownIcon ref={anchorRef} />} // Pass the kebab icon as the anchor
        ref={anchorRef} // Pass anchorRef for positioning
        aria-label="Table dropdown menu"
        className="dropdown-menu"
        {...props}
      >
        {children}
      </DropdownMenu>
    </TableDropdownWrapper>
  );
};

// Add prop-types for validation
TableDropdown.propTypes = {
  children: PropTypes.node.isRequired // Validate that children is a React node
};

export default TableDropdown;
