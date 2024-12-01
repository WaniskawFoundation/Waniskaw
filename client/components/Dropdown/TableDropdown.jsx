import React from 'react';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import { remSize } from '../../theme';
import DropdownMenu from './DropdownMenu';

// import MoreIconSvg from '../../images/more.svg';

/* const DotsHorizontal = styled(MoreIconSvg)`
  transform: rotate(90deg);
`; */

const KebabIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${remSize(20)};
  height: ${remSize(20)};
  margin-left: ${remSize(0)};

  & div {
    width: ${remSize(3)};
    height: ${remSize(3)};
    background-color: white; /* Set dot color to white */
    border-radius: 50%;
    margin: ${remSize(1)} 0;
  }
`;

const TableDropdownIcon = () => {
  // TODO: centralize breakpoints
  const isMobile = useMediaQuery({ maxWidth: 770 });

  return isMobile ? (
    <KebabIcon focusable="false" aria-hidden="true">
      <div />
      <div />
      <div />
    </KebabIcon>
  ) : (
    <button>
      <KebabIcon>
        <div />
        <div />
        <div />
      </KebabIcon>
    </button>
  );
};

const TableDropdown = styled(DropdownMenu).attrs({
  align: 'right',
  anchor: <TableDropdownIcon />
})`
  & > button {
    width: ${remSize(20)};
    height: ${remSize(20)};
    padding: 0;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;

    & svg {
      max-width: 100%;
      max-height: 100%;
    }
  }

  & ul {
    top: 63%;
    right: calc(100% - 21px);
  }
`;

export default TableDropdown;
