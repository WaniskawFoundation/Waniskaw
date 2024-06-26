import React, { useRef, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { useTranslation } from 'react-i18next';
import PlusIcon from '../../../../images/plus_waniskaw.svg';
import MinusIcon from '../../../../images/minus_waniskaw.svg';
import CloseIcon from '../../../../images/close-waniskaw.svg';

import GameIcon from '../../../../images/game.svg';
import GenerativeArtIcon from '../../../../images/generative_art.svg';
import ImagesIcon from '../../../../images/images.svg';
import AssetPackIcon from '../../../../images/asset_pack.svg';
import TutorialIcon from '../../../../images/tutorial.svg';
import ExampleCodeIcon from '../../../../images/example_code.svg';

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

export default function Preferences() {
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

  const [state, setState] = useState({ fontSize });

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

  return (
    <section className="preferences">
      <Helmet>
        <title>p5.js Web Editor | Preferences</title>
      </Helmet>
      <Tabs>
        <TabList>
          <div className="tabs__titles">
            <Tab>
              <h4 className="tabs__title">{t('Preferences.BasicSettings')}</h4>
              <span className="settings_tabline"></span>
            </Tab>
            <Tab>
              <h4 className="tabs__title">{t('Preferences.ProjectSEO')}</h4>
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
          <div className="preference">
            <h3 className="modal-settings-maintitle">Basic Settings</h3>
            <h4 className="preference__title">Project Name</h4>
            <div className="preference-textinput-wrapper">
              <input
                type="text"
                placeholder="Type Project Name"
                className="textinput-field-mini"
              />
            </div>
            <h4 className="preference__title">Project Type</h4>
            <div className="preference__options">
              <input
                type="radio"
                className="preference__radio-button"
                value="ProjectTypeGame"
              />
              <label htmlFor="ProjectTypeGame" className="preference__option">
                <GameIcon className="preference-icon-before" />
                Game
              </label>
              <input
                type="radio"
                className="preference__radio-button"
                value="ProjectTypeGenerativeArt"
              />
              <label
                htmlFor="ProjectTypeGenerativeArt"
                className="preference__option"
              >
                <GenerativeArtIcon className="preference-icon-before" />
                Generative Art
              </label>
              <input
                type="radio"
                className="preference__radio-button"
                value="ProjectTypeImages"
              />
              <label htmlFor="ProjectTypeImages" className="preference__option">
                <ImagesIcon className="preference-icon-before" />
                Images
              </label>
              <input
                type="radio"
                className="preference__radio-button"
                value="ProjectTypeAssetPack"
              />
              <label
                htmlFor="ProjectTypeAssetPack"
                className="preference__option"
              >
                <AssetPackIcon className="preference-icon-before" />
                Asset Pack
              </label>
              <input
                type="radio"
                className="preference__radio-button"
                value="ProjectTypeTutorial"
              />
              <label
                htmlFor="ProjectTypeTutorial"
                className="preference__option"
              >
                <TutorialIcon className="preference-icon-before" />
                Tutorial
              </label>
              <input
                type="radio"
                className="preference__radio-button"
                value="ProjectTypeExampleCode"
              />
              <label
                htmlFor="ProjectTypeExampleCode"
                className="preference__option"
              >
                <ExampleCodeIcon className="preference-icon-before" />
                Example Code
              </label>
            </div>
            <h4 className="preference__title">Main Code File</h4>
            <div className="preference__options">
              <input
                type="radio"
                className="preference__radio-button"
                value="MainCodeFileSketchjs"
              />
              <label
                htmlFor="MainCodeFileSketchjs"
                className="preference__option"
              >
                sketch.js
              </label>
              <input
                type="radio"
                className="preference__radio-button"
                value="MainCodeFileObjectjs"
              />
              <label
                htmlFor="MainCodeFileObjectjs"
                className="preference__option"
              >
                object.js
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
          <div>
            <div className="preference">
              <h3 className="modal-settings-maintitle">
                Search Engine Optimization
              </h3>
              <div className="preference-seo-titlecount-wrapper">
                <h4 className="preference__title">Project Tags</h4>
                <h4 className="preference__title-count">3/4</h4>
              </div>
              <div className="preference__options">
                <input
                  type="radio"
                  className="preference__radio-button"
                  value="game"
                />
                <label htmlFor="prjtags-game" className="preference__option">
                  game
                </label>
                <input
                  type="radio"
                  className="preference__radio-button"
                  value="multiplayer"
                />
                <label
                  htmlFor="prjtags-multiplayer"
                  className="preference__option"
                >
                  multiplayer
                  <CloseIcon className="preference-icon-after" />
                </label>
                <input
                  type="radio"
                  className="preference__radio-button"
                  value="pvp"
                />
                <label htmlFor="prjtags-pvp" className="preference__option">
                  pvp
                  <CloseIcon className="preference-icon-after" />
                </label>
                <input
                  type="radio"
                  className="preference__radio-button"
                  value="mobilegame"
                />
                <label
                  htmlFor="prjtags-mobilegame"
                  className="preference__option"
                >
                  mobilegame
                  <CloseIcon className="preference-icon-after" />
                </label>
                <input
                  type="radio"
                  className="preference__radio-button"
                  value="touchscreen"
                />
                <label
                  htmlFor="prjtags-touchscreen"
                  className="preference__option"
                >
                  touchscreen
                  <CloseIcon className="preference-icon-after" />
                </label>
              </div>
              <div className="preference-textinput-wrapper">
                <input
                  type="text"
                  placeholder="Type New Tag Here"
                  className="textinput-field-mini"
                />
              </div>
              <div className="preference-seo-titlecount-wrapper">
                <h4 className="preference__title">Project Description</h4>
                <h4 className="preference__title-count">3/4</h4>
              </div>
              <div className="preference-textinput-wrapper">
                <input
                  type="text"
                  placeholder="Long-form Text Field"
                  className="textinput-field-long"
                />
              </div>
              <h4 className="preference__title">Image File For Preview</h4>
              <div className="preference__options">
                <input
                  type="radio"
                  className="preference__radio-button"
                  value="coverImagepng"
                />
                <label htmlFor="coverImagepng" className="preference__option">
                  coverImage.png
                </label>
                <input
                  type="radio"
                  className="preference__radio-button"
                  value="coverGeneratorjs"
                />
                <label
                  htmlFor="coverGeneratorjs"
                  className="preference__option"
                >
                  coverGenerator.js
                </label>
                <input
                  type="radio"
                  className="preference__radio-button"
                  value="websiteSnapshothtml"
                />
                <label
                  htmlFor="websiteSnapshothtml"
                  className="preference__option"
                >
                  websiteSnapshot.html
                </label>
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
