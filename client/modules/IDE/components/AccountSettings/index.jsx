import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useTranslation } from 'react-i18next';
import { validateSettings } from '../../../../utils/reduxFormUtils';
import { updateSettings } from '../../../User/actions';
import apiClient from '../../../../utils/apiClient';
import PlusIcon from '../../../../images/plus_waniskaw.svg';
import MinusIcon from '../../../../images/minus_waniskaw.svg';

import beepUrl from '../../../../sounds/audioAlert.mp3';
import {
  setTheme,
  setAutosave,
  setTextOutput,
  setGridOutput,
  setFontSize,
  setLineNumbers,
  setLintWarning,
  setAutocloseBracketsQuotes,
  setAutocompleteHinter,
  setLinewrap
} from '../../actions/preferences';

export default function AccountSettings() {
  const { t } = useTranslation();

  const dispatch = useDispatch();

  const {
    fontSize,
    autosave,
    linewrap,
    lineNumbers,
    lintWarning,
    textOutput,
    gridOutput,
    theme,
    autocloseBracketsQuotes,
    autocompleteHinter
  } = useSelector((state) => state.preferences);

  const username = useSelector((state) => state.user.username);

  const user = useSelector((state) => state.user);

  const [state, setState] = useState({ fontSize });
  const [nickname, setNickname] = useState(username);
  const [url, setUrl] = useState(window.location.origin);
  const [email, setEmail] = useState('');
  const [pronouns, setPronouns] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypeNewPassword, setRetypeNewPassword] = useState('');
  const [CurrentPassword, setCurrentPassword] = useState('');

  const handleNicknameChange = (event) => {
    setNickname(event.target.value);
  };

  const handleURLChange = (event) => {
    setUrl(event.target.value);
  };

  const handlePronounsChange = (event) => {
    setPronouns(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleNewPasswordChange = (event) => {
    setNewPassword(event.target.value);
  };

  const handleRetypeNewPasswordChange = (event) => {
    setRetypeNewPassword(event.target.value);
  };

  const handleCurrentPasswordChange = (event) => {
    setCurrentPassword(event.target.value);
  };

  function onFontInputChange(event) {
    const INTEGER_REGEX = /^[0-9\b]+$/;
    if (event.target.value === '' || INTEGER_REGEX.test(event.target.value)) {
      setState({
        fontSize: event.target.value
      });
    }
  }

  function handleFontSize(value) {
    setState({ fontSize: value });
    dispatch(setFontSize(value));
  }

  function onFontInputSubmit(event) {
    event.preventDefault();
    let value = parseInt(state.fontSize, 10);
    if (Number.isNaN(value)) {
      value = 16;
    }
    if (value > 36) {
      value = 36;
    }
    if (value < 8) {
      value = 8;
    }
    handleFontSize(value);
  }

  function decreaseFontSize() {
    const newValue = Number(state.fontSize) - 2;
    handleFontSize(newValue);
  }

  function increaseFontSize() {
    const newValue = Number(state.fontSize) + 2;
    handleFontSize(newValue);
  }

  const fontSizeInputRef = useRef(null);

  function asyncValidate(fieldToValidate, value) {
    if (!value || value.trim().length === 0) {
      return '';
    }
    const queryParams = {};
    queryParams[fieldToValidate] = value;
    queryParams.check_type = fieldToValidate;
    return apiClient
      .get('/signup/duplicate_check', { params: queryParams })
      .then((response) => {
        if (response.data.exists) {
          return response.data.message;
        }
        return '';
      });
  }

  function validateUsername(input) {
    if (input === user.username) return '';
    return asyncValidate('username', input);
  }

  function validateEmail(input) {
    if (input === user.email) return '';
    return asyncValidate('email', input);
  }

  function onSubmit(formProps) {
    return dispatch(updateSettings(formProps));
  }

  return (
    <section className="preferences">
      <Helmet>
        <title>p5.js Web Editor | Account Settings</title>
      </Helmet>
      <Tabs>
        <TabList>
          <div className="tabs__titles">
            <Tab>
              <h4 className="tabs__title">{t('AccountView.Settings')}</h4>
              <span className="settings_tabline"></span>
            </Tab>
            <Tab>
              <h4 className="tabs__title">
                {`${t('SignupForm.Email')} & ${t('SignupForm.Password')}`}
              </h4>
              <span className="settings_tabline"></span>
            </Tab>
            <Tab>
              <h4 className="tabs__title">
                {t('Preferences.InterfaceSettings')}
              </h4>
              <span className="settings_tabline"></span>
            </Tab>
            <Tab>
              <h4 className="tabs__title">{t('Preferences.Accessibility')}</h4>
              <span className="settings_tabline"></span>
            </Tab>
          </div>
        </TabList>
        <TabPanel>
          <form validate={validateSettings} onSubmit={onSubmit}>
            <div className="preference">
              <h3 className="modal-settings-maintitle">
                {t('AccountView.Settings')}
              </h3>

              <div className="preference-seo-titlecount-wrapper">
                <h4 className="preference__title">Nickname</h4>
                <h4 className="preference__title-count">{`${nickname.length}/20`}</h4>
              </div>
              <div className="preference-textinput-wrapper">
                <input
                  type="text"
                  placeholder="Long-form Text Field"
                  className="textinput-field-long"
                  value={nickname}
                  onChange={handleNicknameChange}
                  maxLength={20}
                  validate={validateUsername}
                />
              </div>
              <div className="preference-seo-titlecount-wrapper">
                <h4 className="preference__title">Profile URL</h4>
              </div>
              <div className="preference-textinput-wrapper input-wrapper d-flex">
                <input
                  type="text"
                  placeholder="Long-form Text Field"
                  className="textinput-field-long"
                  onChange={handleURLChange}
                  value={url}
                  disabled
                />
                <i className="lock-icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M18 10v-4c0-3.313-2.687-6-6-6s-6 2.687-6 6v4h-3v14h18v-14h-3zm-10 0v-4c0-2.206 1.794-4 4-4s4 1.794 4 4v4h-8z" />
                  </svg>
                </i>
              </div>
              <div>
                <p className="popup-light-text">
                  Your link can be changed once you have spent enough time
                  creating projects on Waniskâw.
                </p>
              </div>
              <div className="preference-seo-titlecount-wrapper">
                <h4 className="preference__title">Preferred Pronouns</h4>
              </div>
              <div className="preference-textinput-wrapper">
                <input
                  type="text"
                  placeholder="Type here..."
                  className="textinput-field-long"
                  onChange={handlePronounsChange}
                />
              </div>
              <div className="bottom_btns_wrapper">
                <div className="preference__options">
                  <button type="button" className="bottom_btns_btn">
                    <h6>Cancel</h6>
                  </button>
                  <button type="button" className="bottom_btns_btn">
                    <h6>Save Changes</h6>
                  </button>
                </div>
              </div>
            </div>
          </form>
        </TabPanel>
        <TabPanel>
          <div>
            <div className="preference">
              <h3 className="modal-settings-maintitle">
                {`${t('SignupForm.Email')} & ${t('SignupForm.Password')}`}
              </h3>
              <div className="preference-seo-titlecount-wrapper">
                <h4 className="preference__title">Email</h4>
              </div>
              <div className="preference-textinput-wrapper">
                <input
                  type="text"
                  placeholder="Type here..."
                  className="textinput-field-long"
                  onChange={handleEmailChange}
                  validate={validateEmail}
                />
              </div>
              <div className="preference-seo-titlecount-wrapper">
                <h4 className="preference__title">New Password</h4>
                <h4 className="preference__title-count">
                  {`${newPassword.length}/8`}
                </h4>
              </div>
              <div className="preference-textinput-wrapper">
                <input
                  type="text"
                  placeholder="New password..."
                  className="textinput-field-long"
                  onChange={handleNewPasswordChange}
                />
              </div>
              <div className="preference-seo-titlecount-wrapper">
                <h4 className="preference__title">Retype New Password</h4>
                <h4 className="preference__title-count">
                  {`${retypeNewPassword.length}/8`}
                </h4>
              </div>
              <div className="preference-textinput-wrapper">
                <input
                  type="text"
                  placeholder="New password..."
                  className="textinput-field-long"
                  onChange={handleRetypeNewPasswordChange}
                />
              </div>
              <div>
                <p className="popup-light-text">
                  Your password must contain upper case letters, lower case
                  letters, a number, and a special character.
                </p>
              </div>
              <div className="preference-seo-titlecount-wrapper">
                <h4 className="preference__title">
                  Enter Current Password To Save Changes
                  <span className="popup-red">*</span>
                </h4>
              </div>
              <div className="preference-textinput-wrapper">
                <input
                  type="text"
                  placeholder="Current password..."
                  className="textinput-field-long"
                  onChange={handleCurrentPasswordChange}
                />
              </div>
              <div className="bottom_btns_wrapper">
                <div className="preference__options">
                  <button type="button" className="bottom_btns_btn">
                    <h6>Cancel</h6>
                  </button>
                  <button type="button" className="bottom_btns_btn">
                    <h6>Save Changes</h6>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </TabPanel>
        <TabPanel>
          <div className="preference">
            <h3 className="modal-settings-maintitle">Interface Settings</h3>
            <h4 className="preference__title">{t('Preferences.Theme')}</h4>
            <div className="preference__options">
              <input
                type="radio"
                onChange={() => dispatch(setTheme('light'))}
                aria-label={t('Preferences.LightThemeARIA')}
                name="light theme"
                id="light-theme-on"
                className="preference__radio-button"
                value="light"
                checked={theme === 'light'}
              />
              <label htmlFor="light-theme-on" className="preference__option">
                {t('Preferences.LightTheme')}
              </label>
              <input
                type="radio"
                onChange={() => dispatch(setTheme('dark'))}
                aria-label={t('Preferences.DarkThemeARIA')}
                name="dark theme"
                id="dark-theme-on"
                className="preference__radio-button"
                value="dark"
                checked={theme === 'dark'}
              />
              <label htmlFor="dark-theme-on" className="preference__option">
                {t('Preferences.DarkTheme')}
              </label>
              <input
                type="radio"
                onChange={() => dispatch(setTheme('contrast'))}
                aria-label={t('Preferences.HighContrastThemeARIA')}
                name="high contrast theme"
                id="high-contrast-theme-on"
                className="preference__radio-button"
                value="contrast"
                checked={theme === 'contrast'}
              />
              <label
                htmlFor="high-contrast-theme-on"
                className="preference__option"
              >
                {t('Preferences.HighContrastTheme')}
              </label>
            </div>
          </div>
          <div className="preference">
            <h4 className="preference__title">{t('Preferences.TextSize')}</h4>
            <button
              className="preference__minus-button"
              onClick={decreaseFontSize}
              aria-label={t('Preferences.DecreaseFontARIA')}
              title={t('Preferences.DecreaseFontARIA')}
              disabled={fontSize <= 8}
            >
              <MinusIcon focusable="false" aria-hidden="true" />
            </button>
            <form
              onSubmit={onFontInputSubmit}
              aria-label={t('Preferences.SetFontSize')}
            >
              <label htmlFor="font-size-value" className="preference--hidden">
                {t('Preferences.FontSize')}
              </label>
              <input
                className="preference__value"
                aria-live="polite"
                aria-atomic="true"
                value={state.fontSize}
                id="font-size-value"
                onChange={onFontInputChange}
                type="text"
                ref={fontSizeInputRef}
                onClick={() => {
                  fontSizeInputRef.current?.select();
                }}
              />
            </form>
            <button
              className="preference__plus-button"
              onClick={increaseFontSize}
              aria-label={t('Preferences.IncreaseFontARIA')}
              title={t('Preferences.IncreaseFontARIA')}
              disabled={fontSize >= 36}
            >
              <PlusIcon focusable="false" aria-hidden="true" />
            </button>
          </div>
          <div className="preference">
            <h4 className="preference__title">{t('Preferences.Autosave')}</h4>
            <div className="preference__options">
              <input
                type="radio"
                onChange={() => dispatch(setAutosave(true))}
                aria-label={t('Preferences.AutosaveOnARIA')}
                name="autosave"
                id="autosave-on"
                className="preference__radio-button"
                value="On"
                checked={autosave}
              />
              <label htmlFor="autosave-on" className="preference__option">
                {t('Preferences.On')}
              </label>
              <input
                type="radio"
                onChange={() => dispatch(setAutosave(false))}
                aria-label={t('Preferences.AutosaveOffARIA')}
                name="autosave"
                id="autosave-off"
                className="preference__radio-button"
                value="Off"
                checked={!autosave}
              />
              <label htmlFor="autosave-off" className="preference__option">
                {t('Preferences.Off')}
              </label>
            </div>
          </div>
          <div className="preference">
            <h4 className="preference__title">
              {t('Preferences.AutocloseBracketsQuotes')}
            </h4>
            <div className="preference__options">
              <input
                type="radio"
                onChange={() => dispatch(setAutocloseBracketsQuotes(true))}
                aria-label={t('Preferences.AutocloseBracketsQuotesOnARIA')}
                name="autoclosebracketsquotes"
                id="autoclosebracketsquotes-on"
                className="preference__radio-button"
                value="On"
                checked={autocloseBracketsQuotes}
              />
              <label
                htmlFor="autoclosebracketsquotes-on"
                className="preference__option"
              >
                {t('Preferences.On')}
              </label>
              <input
                type="radio"
                onChange={() => dispatch(setAutocloseBracketsQuotes(false))}
                aria-label={t('Preferences.AutocloseBracketsQuotesOffARIA')}
                name="autoclosebracketsquotes"
                id="autoclosebracketsquotes-off"
                className="preference__radio-button"
                value="Off"
                checked={!autocloseBracketsQuotes}
              />
              <label
                htmlFor="autoclosebracketsquotes-off"
                className="preference__option"
              >
                {t('Preferences.Off')}
              </label>
            </div>
          </div>
          <div className="preference">
            <h4 className="preference__title">
              {t('Preferences.AutocompleteHinter')}
            </h4>
            <div className="preference__options">
              <input
                type="radio"
                onChange={() => dispatch(setAutocompleteHinter(true))}
                aria-label={t('Preferences.AutocompleteHinterOnARIA')}
                name="autocompletehinter"
                id="autocompletehinter-on"
                className="preference__radio-button"
                value="On"
                checked={autocompleteHinter}
              />
              <label
                htmlFor="autocompletehinter-on"
                className="preference__option"
              >
                {t('Preferences.On')}
              </label>
              <input
                type="radio"
                onChange={() => dispatch(setAutocompleteHinter(false))}
                aria-label={t('Preferences.AutocompleteHinterOffARIA')}
                name="autocompletehinter"
                id="autocompletehinter-off"
                className="preference__radio-button"
                value="Off"
                checked={!autocompleteHinter}
              />
              <label
                htmlFor="autocompletehinter-off"
                className="preference__option"
              >
                {t('Preferences.Off')}
              </label>
            </div>
          </div>
          <div className="preference">
            <h4 className="preference__title">{t('Preferences.WordWrap')}</h4>
            <div className="preference__options">
              <input
                type="radio"
                onChange={() => dispatch(setLinewrap(true))}
                aria-label={t('Preferences.LineWrapOnARIA')}
                name="linewrap"
                id="linewrap-on"
                className="preference__radio-button"
                value="On"
                checked={linewrap}
              />
              <label htmlFor="linewrap-on" className="preference__option">
                {t('Preferences.On')}
              </label>
              <input
                type="radio"
                onChange={() => dispatch(setLinewrap(false))}
                aria-label={t('Preferences.LineWrapOffARIA')}
                name="linewrap"
                id="linewrap-off"
                className="preference__radio-button"
                value="Off"
                checked={!linewrap}
              />
              <label htmlFor="linewrap-off" className="preference__option">
                {t('Preferences.Off')}
              </label>
            </div>
          </div>
          <div className="bottom_btns_wrapper">
            <div className="preference__options">
              <button
                type="button"
                className="bottom_btns_btn"
                // onChange={() => dispatch(setTheme('contrast'))}
              >
                <h6>Cancel</h6>
              </button>
              <button
                type="button"
                className="bottom_btns_btn"
                // onChange={() => dispatch(setTheme('contrast'))}
              >
                <h6>Save Changes</h6>
              </button>
            </div>
          </div>
        </TabPanel>

        <TabPanel>
          <div className="preference">
            <h3 className="modal-settings-maintitle">Accessibility</h3>
            <h4 className="preference__title">
              {t('Preferences.LineNumbers')}
            </h4>
            <div className="preference__options">
              <input
                type="radio"
                onChange={() => dispatch(setLineNumbers(true))}
                aria-label={t('Preferences.LineNumbersOnARIA')}
                name="line numbers"
                id="line-numbers-on"
                className="preference__radio-button"
                value="On"
                checked={lineNumbers}
              />
              <label htmlFor="line-numbers-on" className="preference__option">
                {t('Preferences.On')}
              </label>
              <input
                type="radio"
                onChange={() => dispatch(setLineNumbers(false))}
                aria-label={t('Preferences.LineNumbersOffARIA')}
                name="line numbers"
                id="line-numbers-off"
                className="preference__radio-button"
                value="Off"
                checked={!lineNumbers}
              />
              <label htmlFor="line-numbers-off" className="preference__option">
                {t('Preferences.Off')}
              </label>
            </div>
          </div>
          <div className="preference">
            <h4 className="preference__title">
              {t('Preferences.LintWarningSound')}
            </h4>
            <div className="preference__options">
              <input
                type="radio"
                onChange={() => dispatch(setLintWarning(true))}
                aria-label={t('Preferences.LintWarningOnARIA')}
                name="lint warning"
                id="lint-warning-on"
                className="preference__radio-button"
                value="On"
                checked={lintWarning}
              />
              <label htmlFor="lint-warning-on" className="preference__option">
                {t('Preferences.On')}
              </label>
              <input
                type="radio"
                onChange={() => dispatch(setLintWarning(false))}
                aria-label={t('Preferences.LintWarningOffARIA')}
                name="lint warning"
                id="lint-warning-off"
                className="preference__radio-button"
                value="Off"
                checked={!lintWarning}
              />
              <label htmlFor="lint-warning-off" className="preference__option">
                {t('Preferences.Off')}
              </label>
              <button
                className="preference__option custom-preview-button"
                // className="preference__preview-button"
                onClick={() => new Audio(beepUrl).play()}
                aria-label={t('Preferences.PreviewSoundARIA')}
              >
                {t('Preferences.PreviewSound')}
              </button>
            </div>
          </div>
          <div className="preference">
            <h4 className="preference__title">
              {t('Preferences.AccessibleTextBasedCanvas')}
            </h4>
            <div className="pref-minitext-wrapper">
              <h6 className="pref-minitext">
                {t('Preferences.UsedScreenReader')}
              </h6>

              <div className="preference__options pref-btnswrapper">
                <div className="pref-btnbox">
                  <input
                    type="checkbox"
                    onChange={(event) => {
                      dispatch(setTextOutput(event.target.checked));
                    }}
                    aria-label={t('Preferences.TextOutputARIA')}
                    name="text output"
                    id="text-output-on"
                    className="custom-checkbox"
                    value="On"
                    checked={textOutput}
                  />
                  <label
                    htmlFor="text-output-on"
                    className="preference__canvas"
                  >
                    {t('Preferences.PlainText')}
                  </label>
                </div>
                <div className="pref-btnbox">
                  <input
                    type="checkbox"
                    onChange={(event) => {
                      dispatch(setGridOutput(event.target.checked));
                    }}
                    aria-label={t('Preferences.TableOutputARIA')}
                    name="table output"
                    id="table-output-on"
                    value="On"
                    checked={gridOutput}
                  />
                  <label
                    htmlFor="table-output-on"
                    className="preference__canvas"
                  >
                    {t('Preferences.TableText')}
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="bottom_btns_wrapper">
            <div className="preference__options">
              <button
                type="button"
                className="bottom_btns_btn"
                // onChange={() => dispatch(setTheme('contrast'))}
              >
                <h6>Cancel</h6>
              </button>
              <button
                type="button"
                className="bottom_btns_btn"
                // onChange={() => dispatch(setTheme('contrast'))}
              >
                <h6>Save Changes</h6>
              </button>
            </div>
          </div>
        </TabPanel>
      </Tabs>
    </section>
  );
}
