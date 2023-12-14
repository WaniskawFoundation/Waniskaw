import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  setAutorefresh,
  setGridOutput,
  setTextOutput
} from '../../actions/preferences';

import ProjectName from './ProjectName';

const Toolbar = (props) => {
  const project = useSelector((state) => state.project);
  const autorefresh = useSelector((state) => state.preferences.autorefresh);
  const dispatch = useDispatch();

  const { t } = useTranslation();

  return (
    <div></div>
    // <div className="toolbar">
    //   <div className="toolbar__autorefresh">
    //     <input
    //       id="autorefresh"
    //       className="checkbox__autorefresh"
    //       type="checkbox"
    //       checked={autorefresh}
    //       onChange={(event) => {
    //         dispatch(setAutorefresh(event.target.checked));
    //       }}
    //     />
    //     <label htmlFor="autorefresh" className="toolbar__autorefresh-label">
    //       {t('Toolbar.Auto-refresh')}
    //     </label>
    //   </div>
    //   <div className="toolbar__project-name-container">
    //     <ProjectName />
    //     {(() => {
    //       if (project.owner) {
    //         return (
    //           <p className="toolbar__project-project.owner">
    //             {t('Toolbar.By')}{' '}
    //             <Link to={`/${project.owner.username}/sketches`}>
    //               {project.owner.username}
    //             </Link>
    //           </p>
    //         );
    //       }
    //       return null;
    //     })()}
    //   </div>
    //   {/* <button
    //     className={preferencesButtonClass}
    //     onClick={() => dispatch(openPreferences())}
    //     aria-label={t('Toolbar.OpenPreferencesARIA')}
    //     title={t('Toolbar.OpenPreferencesARIA')}
    //   >
    //     <PreferencesIcon focusable="false" aria-hidden="true" />
    //   </button> */}
    // </div>
  );
};

// Toolbar.propTypes = {
//   syncFileContent: PropTypes.func.isRequired
// };

export default Toolbar;
