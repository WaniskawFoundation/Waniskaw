import React, { useRef, useState } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  closeProjectOptions,
  collapseSidebar,
  newFile,
  newFolder,
  openProjectOptions,
  openUploadFileModal
} from '../actions/ide';
import { selectRootFile } from '../selectors/files';
import { getAuthenticated, selectCanEditSketch } from '../selectors/users';

import ConnectedFileNode from './FileNode';
// import { PlusIcon } from '../../../common/icons';
import { FileDrawer } from './Editor/MobileEditor';
import AddFileIcon from '../../../images/add-file.svg';
import AddFolderIcon from '../../../images/add-folder.svg';
import UploadIcon from '../../../images/upload.svg';

// TODO: use a generic Dropdown UI component

export default function SideBar() {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const rootFile = useSelector(selectRootFile);
  const files = useSelector((state) => state.files);
  const ide = useSelector((state) => state.ide);
  const projectOptionsVisible = useSelector(
    (state) => state.ide.projectOptionsVisible
  );
  const isExpanded = useSelector((state) => state.ide.sidebarIsExpanded);
  const canEditProject = useSelector(selectCanEditSketch);

  const sidebarOptionsRef = useRef(null);

  const [isFocused, setIsFocused] = useState(false);

  const isAuthenticated = useSelector(getAuthenticated);

  // get sizes for all files
  const byteSize = (str) => new Blob([str]).size;

  const getTotalFileSize = (file) =>
    file.fileType === 'file'
      ? byteSize(file.content)
      : file.children
          .map((child) => getTotalFileSize(files.find((f) => f.id === child)))
          .reduce((prev, curr) => prev + curr);

  const genFileSizeString = (size) => {
    let suffix = 'Bytes';
    let divisor = 1;
    if (size > 1000) {
      suffix = 'KB';
      divisor = 1000;
    } else if (size > 1000000) {
      suffix = 'MB';
      divisor = 1000000;
    } else if (size > 1000000000) {
      suffix = 'KB';
      divisor = 1000000000;
    }

    return `${(size / divisor).toFixed(1)} ${suffix}`;
  };

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

  const footerStyle = { display: ide.sidebarIsExpanded ? null : 'none' };

  return (
    <FileDrawer>
      {ide.sidebarIsExpanded && (
        <button
          data-backdrop="filedrawer"
          onClick={() => {
            dispatch(collapseSidebar());
            dispatch(closeProjectOptions());
          }}
        >
          {' '}
        </button>
      )}
      <section className={sidebarClass}>
        <header
          id="sidebar__toolbar-portal"
          className="sidebar__header"
          onContextMenu={toggleProjectOptions}
        />
        <ConnectedFileNode id={rootFile.id} canEdit={canEditProject} />
      </section>
      <div className="sidebar__footer" style={footerStyle}>
        <div className="sidebar__footer-project-size">
          {genFileSizeString(getTotalFileSize(rootFile))}
        </div>
        <div className="sidebar__footer-buttons">
          {isAuthenticated && (
            <UploadIcon
              className="sidebar__footer-button"
              fill="white"
              aria-label={t('Sidebar.UploadFileARIA')}
              onClick={() => {
                dispatch(openUploadFileModal(rootFile.id));
                setTimeout(() => dispatch(closeProjectOptions()), 0);
              }}
              onBlur={onBlurComponent}
              onFocus={onFocusComponent}
            >
              {t('Sidebar.UploadFile')}
            </UploadIcon>
          )}
          {isAuthenticated && (
            <div className="sidebar__footer-buttons-spacer" />
          )}
          <AddFileIcon
            className="sidebar__footer-button"
            onClick={() => {
              dispatch(newFile(rootFile.id));
              setTimeout(() => dispatch(closeProjectOptions()), 0);
            }}
            onBlur={onBlurComponent}
            onFocus={onFocusComponent}
            fill="white"
            viewBox="0 -1060 1200 1200"
          />
          <AddFolderIcon
            className="sidebar__footer-button"
            aria-label={t('Sidebar.AddFolderARIA')}
            onClick={() => {
              dispatch(newFolder(rootFile.id));
              setTimeout(() => dispatch(closeProjectOptions()), 0);
            }}
            onBlur={onBlurComponent}
            onFocus={onFocusComponent}
            fill="white"
            viewBox="0 -1100 1200 1200"
          />
        </div>
      </div>
    </FileDrawer>
  );
}
