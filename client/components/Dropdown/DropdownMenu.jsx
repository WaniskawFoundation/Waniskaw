import PropTypes from 'prop-types';
import React, { forwardRef, useCallback, useRef, useState } from 'react';
import useModalClose from '../../common/useModalClose';
import DownArrowIcon from '../../images/down-filled-triangle.svg';
import { DropdownWrapper } from '../Dropdown';

// TODO: enable arrow keys to navigate options from list

const DropdownMenu = forwardRef(
  (
    { children, anchor, 'aria-label': ariaLabel, align, className, classes },
    ref
  ) => {
    // Ref to track focus state
    const focusedRef = useRef(false);

    // Dropdown open state
    const [isOpen, setIsOpen] = useState(false);

    // Callback to close the dropdown
    const close = useCallback(() => setIsOpen(false), [setIsOpen]);

    // Anchor ref for positioning
    const anchorRef = useModalClose(close, ref);

    // Toggle dropdown visibility
    const toggle = useCallback(() => {
      setIsOpen((prevState) => !prevState);
    }, [setIsOpen]);

    // Handle focus events
    const handleFocus = () => {
      focusedRef.current = true;
    };

    const handleBlur = () => {
      focusedRef.current = false;
      setTimeout(() => {
        if (!focusedRef.current) {
          close();
        }
      }, 200);
    };

    return (
      <div ref={anchorRef} className={className}>
        <button
          className={classes.button}
          aria-label={ariaLabel}
          tabIndex="0"
          onClick={toggle}
          onBlur={handleBlur}
          onFocus={handleFocus}
        >
          {/* Use the provided anchor or a default icon */}
          {anchor ?? <DownArrowIcon focusable="false" aria-hidden="true" />}
        </button>
        {isOpen && (
          <DropdownWrapper
            className={classes.list}
            align={align}
            anchorRef={anchorRef} // Pass anchorRef for positioning
            onMouseUp={() => {
              setTimeout(close, 0);
            }}
            onBlur={handleBlur}
            onFocus={handleFocus}
          >
            {children}
          </DropdownWrapper>
        )}
      </div>
    );
  }
);

DropdownMenu.propTypes = {
  /**
   * Provide <MenuItem> elements as children to control the contents of the menu.
   */
  children: PropTypes.node.isRequired,
  /**
   * Can optionally override the contents of the button which opens the menu.
   * Defaults to <DownArrowIcon>
   */
  anchor: PropTypes.node,
  'aria-label': PropTypes.string.isRequired,
  align: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  classes: PropTypes.shape({
    button: PropTypes.string,
    list: PropTypes.string
  })
};

DropdownMenu.defaultProps = {
  anchor: null,
  align: 'right',
  className: '',
  classes: {}
};

export default DropdownMenu;
