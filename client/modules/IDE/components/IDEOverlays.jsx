import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import ReactDOM from 'react-dom';
import Overlay from '../../App/components/Overlay';
import {
  closeKeyboardShortcutModal,
  closeFundraiserModal,
  closePreferences,
  closeShareModal,
  hideErrorModal,
  closeAccountSettings
} from '../actions/ide';
import About from './About';
import AddToCollectionList from './AddToCollectionList';
import ErrorModal from './ErrorModal';
import Feedback from './Feedback';
import KeyboardShortcutModal from './KeyboardShortcutModal';
import FundraiserModal from './FundraiserModal';
import NewFileModal from './NewFileModal';
import NewFolderModal from './NewFolderModal';
import Preferences from './Preferences';
import { CollectionSearchbar } from './Searchbar';
import ShareModal from './ShareModal';
import UploadFileModal from './UploadFileModal';
import AccountSettings from './AccountSettings';

export default function IDEOverlays() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const location = useLocation();
  const params = useParams();

  const {
    modalIsVisible,
    newFolderModalVisible,
    uploadFileModalVisible,
    preferencesIsVisible,
    keyboardShortcutVisible,
    fundraiserContentVisible,
    shareModalVisible,
    shareModalProjectId,
    shareModalProjectName,
    shareModalProjectUsername,
    errorType,
    previousPath,
    accountSettingsIsVisible
  } = useSelector((state) => state.ide);

  return ReactDOM.createPortal(
    <>
      {accountSettingsIsVisible && (
        <Overlay
          title="Account Settings"
          ariaLabel="Account Settings"
          closeOverlay={() => dispatch(closeAccountSettings())}
        >
          <AccountSettings />
        </Overlay>
      )}
      {preferencesIsVisible && (
        <Overlay
          title={t('Preferences.Settings')}
          ariaLabel={t('Preferences.Settings')}
          closeOverlay={() => dispatch(closePreferences())}
        >
          <Preferences />
        </Overlay>
      )}
      {location.pathname === '/about' && (
        <Overlay
          title={t('About.Title')}
          previousPath={previousPath}
          ariaLabel={t('About.Title')}
        >
          <About />
        </Overlay>
      )}
      {location.pathname === '/feedback' && (
        <Overlay
          title={t('IDEView.SubmitFeedback')}
          previousPath={previousPath}
          ariaLabel={t('IDEView.SubmitFeedbackARIA')}
        >
          <Feedback />
        </Overlay>
      )}
      {location.pathname.match(/add-to-collection$/) && (
        <Overlay
          ariaLabel={t('IDEView.AddCollectionARIA')}
          title={t('IDEView.AddCollectionTitle')}
          previousPath={previousPath}
          actions={<CollectionSearchbar />}
          isFixedHeight
        >
          <AddToCollectionList
            projectId={params.project_id}
            username={params.username}
          />
        </Overlay>
      )}
      {shareModalVisible && (
        <Overlay
          title={t('IDEView.ShareTitle')}
          ariaLabel={t('IDEView.ShareARIA')}
          closeOverlay={() => dispatch(closeShareModal())}
        >
          <ShareModal
            projectId={shareModalProjectId}
            projectName={shareModalProjectName}
            ownerUsername={shareModalProjectUsername}
          />
        </Overlay>
      )}
      {keyboardShortcutVisible && (
        <Overlay
          title={t('KeyboardShortcuts.Title')}
          ariaLabel={t('KeyboardShortcuts.Title')}
          closeOverlay={() => dispatch(closeKeyboardShortcutModal())}
        >
          <KeyboardShortcutModal />
        </Overlay>
      )}
      {fundraiserContentVisible && (
        <Overlay
          title={t('Fundraiser.Title')}
          ariaLabel={t('Fundraiser.Title')}
          closeOverlay={() => dispatch(closeFundraiserModal())}
        >
          <FundraiserModal />
        </Overlay>
      )}
      {errorType && (
        <Overlay
          title={t('Common.Error')}
          ariaLabel={t('Common.ErrorARIA')}
          closeOverlay={() => dispatch(hideErrorModal())}
        >
          <ErrorModal
            type={errorType}
            closeModal={() => dispatch(hideErrorModal())}
          />
        </Overlay>
      )}
      {modalIsVisible && <NewFileModal />}
      {newFolderModalVisible && <NewFolderModal />}
      {uploadFileModalVisible && <UploadFileModal />}
    </>,
    document.body
  );
}
