import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import {
  closeProjectOptions,
  collapseSidebar,
  newFile,
  newFolder,
  openProjectOptions,
  openUploadFileModal,
  openPreferences,
  startAccessibleSketch,
  startSketch,
  stopSketch
} from '../actions/ide';
import { selectRootFile } from '../selectors/files';
import { getAuthenticated, selectCanEditSketch } from '../selectors/users';

import ConnectedFileNode from './FileNode';
import { PlusIcon } from '../../../common/icons';
import { FileDrawer } from './Editor/MobileEditor';
import {
  setAutorefresh,
  setGridOutput,
  setTextOutput
} from '../actions/preferences';
import PlayIcon from '../../../images/play.svg';
import StopIcon from '../../../images/stop.svg';

import PreferencesIcon from '../../../images/preferences.svg';

export default function SideBar(props) {
  const { isPlaying, infiniteLoop, preferencesIsVisible } = useSelector(
    (state) => state.ide
  );
  const project = useSelector((state) => state.project);
  const autorefresh = useSelector((state) => state.preferences.autorefresh);

  const playButtonClass = classNames({
    'toolbar__play-button': true,
    'toolbar__play-button--selected': isPlaying
  });
  const stopButtonClass = classNames({
    'toolbar__stop-button': true,
    'toolbar__stop-button--selected': !isPlaying
  });
  const preferencesButtonClass = classNames({
    'toolbar__preferences-button': true,
    'toolbar__preferences-button--selected': preferencesIsVisible
  });

  const { t } = useTranslation();
  const dispatch = useDispatch();

  const rootFile = useSelector(selectRootFile);
  const ide = useSelector((state) => state.ide);
  const projectOptionsVisible = useSelector(
    (state) => state.ide.projectOptionsVisible
  );
  const isExpanded = useSelector((state) => state.ide.sidebarIsExpanded);
  const canEditProject = useSelector(selectCanEditSketch);

  const sidebarOptionsRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);

  const isAuthenticated = useSelector(getAuthenticated);

  const onBlurComponent = () => {
    setIsFocused(false);
    setTimeout(() => {
      if (!isFocused) {
        dispatch(closeProjectOptions());
      }
    }, 200);
  };

  const onFocusComponent = () => {
    setIsFocused(true);
  };

  const toggleProjectOptions = (e) => {
    e.preventDefault();
    if (projectOptionsVisible) {
      dispatch(closeProjectOptions());
    } else {
      sidebarOptionsRef.current?.focus();
      dispatch(openProjectOptions());
    }
  };

  const sidebarClass = classNames({
    sidebar: true,
    'sidebar--contracted': !isExpanded,
    'sidebar--project-options': projectOptionsVisible,
    'sidebar--cant-edit': !canEditProject
  });

  return (
    // <FileDrawer>
    //   {ide.sidebarIsExpanded && (
    //     <button
    //       data-backdrop="filedrawer"
    //       onClick={() => {
    //         dispatch(collapseSidebar());
    //         dispatch(closeProjectOptions());
    //       }}
    //     >
    //       {' '}
    //     </button>
    //   )}
    <div>
      <div className="toolbar-buttons-container">
        <button
          className="toolbar__play-sketch-button"
          onClick={() => {
            dispatch(startAccessibleSketch());
            dispatch(setTextOutput(true));
            dispatch(setGridOutput(true));
          }}
          aria-label={t('Toolbar.PlaySketchARIA')}
          disabled={infiniteLoop}
        >
          <PlayIcon focusable="false" aria-hidden="true" />
        </button>
        <button
          className={playButtonClass}
          onClick={() => {
            dispatch(startSketch());
          }}
          aria-label={t('Toolbar.PlayOnlyVisualSketchARIA')}
          title={t('Toolbar.PlaySketchARIA')}
          disabled={infiniteLoop}
        >
          <PlayIcon focusable="false" aria-hidden="true" />
        </button>
        <button
          className={stopButtonClass}
          onClick={() => dispatch(stopSketch())}
          aria-label={t('Toolbar.StopSketchARIA')}
          title={t('Toolbar.StopSketchARIA')}
        >
          <StopIcon focusable="false" aria-hidden="true" />
        </button>
        <button
          className={preferencesButtonClass}
          onClick={() => dispatch(openPreferences())}
          aria-label={t('Toolbar.OpenPreferencesARIA')}
          title={t('Toolbar.OpenPreferencesARIA')}
        >
          <PreferencesIcon focusable="false" aria-hidden="true" />
        </button>
      </div>

      <section className={sidebarClass}>
        <header
          className="sidebar__header"
          onContextMenu={toggleProjectOptions}
        >
          <h3 className="sidebar__title">
            <span>{t('Sidebar.Title')}</span>
          </h3>
          <div className="sidebar__icons">
            <button
              aria-label={t('Sidebar.ToggleARIA')}
              className="sidebar__add"
              tabIndex="0"
              ref={sidebarOptionsRef}
              onClick={toggleProjectOptions}
              onBlur={onBlurComponent}
              onFocus={onFocusComponent}
            >
              <PlusIcon focusable="false" aria-hidden="true" />
            </button>
            <ul className="sidebar__project-options">
              <li>
                <button
                  aria-label={t('Sidebar.AddFolderARIA')}
                  onClick={() => {
                    dispatch(newFolder(rootFile.id));
                    setTimeout(() => dispatch(closeProjectOptions()), 0);
                  }}
                  onBlur={onBlurComponent}
                  onFocus={onFocusComponent}
                >
                  {t('Sidebar.AddFolder')}
                </button>
              </li>
              <li>
                <button
                  aria-label={t('Sidebar.AddFileARIA')}
                  onClick={() => {
                    dispatch(newFile(rootFile.id));
                    setTimeout(() => dispatch(closeProjectOptions()), 0);
                  }}
                  onBlur={onBlurComponent}
                  onFocus={onFocusComponent}
                >
                  {t('Sidebar.AddFile')}
                </button>
              </li>
              {isAuthenticated && (
                <li>
                  <button
                    aria-label={t('Sidebar.UploadFileARIA')}
                    onClick={() => {
                      dispatch(openUploadFileModal(rootFile.id));
                      setTimeout(() => dispatch(closeProjectOptions()), 0);
                    }}
                    onBlur={onBlurComponent}
                    onFocus={onFocusComponent}
                  >
                    {t('Sidebar.UploadFile')}
                  </button>
                </li>
              )}
            </ul>
          </div>
        </header>
        <ConnectedFileNode id={rootFile.id} canEdit={canEditProject} />
      </section>
    </div>
    // </FileDrawer>
  );
  // Sidebar.propTypes = {
  // syncFileContent: PropTypes.func.isRequired
  // };
}
