import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import MediaQuery from 'react-responsive';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

import Nav from './Nav';
import Toolbar from '../../components/Header/Toolbar';

const Header = (props) => {
  const project = useSelector((state) => state.project);
  const [portalElt, setPortalElt] = useState(null);

  useEffect(() => {
    setPortalElt(document.getElementById('sidebar__toolbar-portal'));
  }, []);

  return (
    <header>
      <Nav />
      <MediaQuery minWidth={770}>
        {(matches) => {
          if (matches && portalElt)
            return createPortal(
              <Toolbar
                syncFileContent={props.syncFileContent}
                key={project.id}
              />,
              portalElt
            );
          return null;
        }}
      </MediaQuery>
    </header>
  );
};

Header.propTypes = {
  syncFileContent: PropTypes.func.isRequired
};

export default Header;
