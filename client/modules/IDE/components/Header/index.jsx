import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Nav from './Nav';

const Header = (props) => {
  const project = useSelector((state) => state.project);
  const [portalElt, setPortalElt] = useState(null);

  useEffect(() => {
    setPortalElt(document.getElementById('sidebar__toolbar-portal'));
  }, []);

  return (
    <header>
      <Nav />
      {/* <MediaQuery minWidth={770}>
        {(matches) => {
          if (matches && portalElt)
            return ReactDOM.createPortal(
              <Toolbar
                syncFileContent={props.syncFileContent}
                key={project.id}
              />,
              portalElt
            );
          return null;
        }}
      </MediaQuery> */}
    </header>
  );
};

// Header.propTypes = {
//   syncFileContent: PropTypes.func.isRequired
// };

export default Header;
