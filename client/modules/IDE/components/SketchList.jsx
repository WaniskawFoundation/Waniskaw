import PropTypes from 'prop-types';
import React from 'react';
import { Helmet } from 'react-helmet';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';
import slugify from 'slugify';
import MenuItem from '../../../components/Dropdown/MenuItem';
import TableDropdown from '../../../components/Dropdown/TableDropdown';
import * as ProjectActions from '../actions/project';
import * as ProjectsActions from '../actions/projects';
import * as CollectionsActions from '../actions/collections';
import * as ToastActions from '../actions/toast';
import * as SortingActions from '../actions/sorting';
import * as IdeActions from '../actions/ide';
import getSortedSketches from '../selectors/projects';
import Loader from '../../App/components/loader';
import Overlay from '../../App/components/Overlay';
import AddToCollectionList from './AddToCollectionList';
import getConfig from '../../../utils/getConfig';

import ArrowUpIcon from '../../../images/sort-arrow-up.svg';
import ArrowDownIcon from '../../../images/sort-arrow-down.svg';
import sketchPlaceholder from '../../../images/sketch_placeholder.png';

import GameIcon from '../../../images/game.svg';
import GenerativeArtIcon from '../../../images/generative_art.svg';
import ImagesIcon from '../../../images/images.svg';
import AssetPackIcon from '../../../images/asset_pack.svg';
import TutorialIcon from '../../../images/tutorial.svg';
import ExampleCodeIcon from '../../../images/example_code.svg';

const ROOT_URL = getConfig('API_URL');

// Mapping types to icons
const iconMap = {
  game: GameIcon,
  generative_art: GenerativeArtIcon,
  images: ImagesIcon,
  asset_pack: AssetPackIcon,
  tutorial: TutorialIcon,
  example_code: ExampleCodeIcon
};

// Function to get the icon based on type
const getIconByType = (type) => {
  const IconComponent = iconMap[type];
  return IconComponent ? <IconComponent /> : <ExampleCodeIcon />;
};

class SketchGridItemBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renameOpen: false,
      renameValue: props.sketch.name
    };
    this.renameInput = React.createRef();
  }

  openRename = () => {
    this.setState(
      {
        renameOpen: true,
        renameValue: this.props.sketch.name
      },
      () => this.renameInput.current.focus()
    );
  };

  closeRename = () => {
    this.setState({
      renameOpen: false
    });
  };

  handleRenameChange = (e) => {
    this.setState({
      renameValue: e.target.value
    });
  };

  handleRenameEnter = (e) => {
    if (e.key === 'Enter') {
      this.updateName();
      this.closeRename();
    }
  };

  handleRenameBlur = () => {
    this.updateName();
    this.closeRename();
  };

  updateName = () => {
    const isValid = this.state.renameValue.trim().length !== 0;
    if (isValid) {
      this.props.changeProjectName(
        this.props.sketch.id,
        this.state.renameValue.trim()
      );
    }
  };

  handleSketchDownload = () => {
    const { sketch } = this.props;
    const downloadLink = document.createElement('a');
    downloadLink.href = `${ROOT_URL}/projects/${sketch.id}/zip`;
    downloadLink.download = `${sketch.name}.zip`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  handleSketchDuplicate = () => {
    this.props.cloneProject(this.props.sketch);
  };

  handleSketchShare = () => {
    this.props.showShareModal(
      this.props.sketch.id,
      this.props.sketch.name,
      this.props.username
    );
  };

  handleSketchDelete = () => {
    if (
      window.confirm(
        this.props.t('Common.DeleteConfirmation', {
          name: this.props.sketch.name
        })
      )
    ) {
      this.props.deleteProject(this.props.sketch.id);
    }
  };

  renderDropdown = () => {
    const userIsOwner = this.props.user.username === this.props.username;

    return (
      <td className="sketch-list__dropdown-column">
        <TableDropdown aria-label={this.props.t('SketchList.ToggleLabelARIA')}>
          <MenuItem hideIf={!userIsOwner} onClick={this.openRename}>
            {this.props.t('SketchList.DropdownRename')}
          </MenuItem>
          <MenuItem onClick={this.handleSketchDownload}>
            {this.props.t('SketchList.DropdownDownload')}
          </MenuItem>
          <MenuItem
            hideIf={!this.props.user.authenticated}
            onClick={this.handleSketchDuplicate}
          >
            {this.props.t('SketchList.DropdownDuplicate')}
          </MenuItem>
          <MenuItem
            hideIf={!this.props.user.authenticated}
            onClick={() => {
              this.props.onAddToCollection();
            }}
          >
            {this.props.t('SketchList.DropdownAddToCollection')}
          </MenuItem>

          {/*
          <MenuItem onClick={this.handleSketchShare}>
            Share
          </MenuItem>
            */}
          <MenuItem hideIf={!userIsOwner} onClick={this.handleSketchDelete}>
            {this.props.t('SketchList.DropdownDelete')}
          </MenuItem>
        </TableDropdown>
      </td>
    );
  };

  render() {
    const { sketch, username, mobile } = this.props;
    const { renameOpen, renameValue } = this.state;
    let url = `/r/${username}/${sketch.id}`;
    if (username === 'p5') {
      url = `/r/${username}/${slugify(sketch.name, '_')}`;
    }

    // Keep mobile props handy in case I want to use this..
    if (mobile) console.log('mobile');

    const name = (
      <React.Fragment>
        <Link className="sketch-name" to={url}>
          {renameOpen ? '' : sketch.name}
        </Link>
        {renameOpen && (
          <input
            value={renameValue}
            onChange={this.handleRenameChange}
            onKeyUp={this.handleRenameEnter}
            onBlur={this.handleRenameBlur}
            onClick={(e) => e.stopPropagation()}
            ref={this.renameInput}
          />
        )}
      </React.Fragment>
    );

    const handleClick = () => {
      window.location.href = url;
    };

    return (
      <React.Fragment>
        <div className="sketch-item-container" key={sketch.id}>
          <img
            className="sketch-item-image"
            src={sketchPlaceholder}
            alt="no-img"
            onClick={handleClick}
            onKeyDown={handleClick}
            role="presentation"
          />
          <div className="sketch-info-container">
            <div className="sketch-info-left">
              <div className="sketch-type">
                {getIconByType(sketch.project_type)}
              </div>
              <div className="sketch-name-container">
                <div className="sketch-name">{name}</div>
                <div className="sketch-description">
                  A description of this sketch!
                </div>
              </div>
            </div>
            {this.renderDropdown()}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

SketchGridItemBase.propTypes = {
  sketch: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    updatedAt: PropTypes.string.isRequired,
    project_type: PropTypes.string.isRequired
  }).isRequired,
  username: PropTypes.string.isRequired,
  user: PropTypes.shape({
    username: PropTypes.string,
    authenticated: PropTypes.bool.isRequired
  }).isRequired,
  deleteProject: PropTypes.func.isRequired,
  showShareModal: PropTypes.func.isRequired,
  cloneProject: PropTypes.func.isRequired,
  changeProjectName: PropTypes.func.isRequired,
  onAddToCollection: PropTypes.func.isRequired,
  mobile: PropTypes.bool,
  t: PropTypes.func.isRequired
};

SketchGridItemBase.defaultProps = {
  mobile: false
};

function mapDispatchToPropsSketchListRow(dispatch) {
  return bindActionCreators(
    Object.assign({}, ProjectActions, IdeActions),
    dispatch
  );
}

const SketchGridItem = connect(
  null,
  mapDispatchToPropsSketchListRow
)(SketchGridItemBase);

class SketchList extends React.Component {
  constructor(props) {
    super(props);
    this.props.getProjects(this.props.username);
    this.props.resetSorting();

    this.state = {
      isInitialDataLoad: true
    };
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.sketches !== prevProps.sketches &&
      Array.isArray(this.props.sketches)
    ) {
      // eslint-disable-next-line react/no-did-update-set-state
      this.setState({
        isInitialDataLoad: false
      });
    }
  }

  getSketchesTitle() {
    if (this.props.username === this.props.user.username) {
      return this.props.t('SketchList.Title');
    }
    return this.props.t('SketchList.AnothersTitle', {
      anotheruser: this.props.username
    });
  }

  hasSketches() {
    return !this.isLoading() && this.props.sketches.length > 0;
  }

  isLoading() {
    return this.props.loading && this.state.isInitialDataLoad;
  }

  _renderLoader() {
    if (this.isLoading()) return <Loader />;
    return null;
  }

  _renderEmptyTable() {
    if (!this.isLoading() && this.props.sketches.length === 0) {
      return (
        <p className="sketches-table__empty">
          {this.props.t('SketchList.NoSketches')}
        </p>
      );
    }
    return null;
  }

  _getButtonLabel = (fieldName, displayName) => {
    const { field, direction } = this.props.sorting;
    let buttonLabel;
    if (field !== fieldName) {
      if (field === 'name') {
        buttonLabel = this.props.t('SketchList.ButtonLabelAscendingARIA', {
          displayName
        });
      } else {
        buttonLabel = this.props.t('SketchList.ButtonLabelDescendingARIA', {
          displayName
        });
      }
    } else if (direction === SortingActions.DIRECTION.ASC) {
      buttonLabel = this.props.t('SketchList.ButtonLabelDescendingARIA', {
        displayName
      });
    } else {
      buttonLabel = this.props.t('SketchList.ButtonLabelAscendingARIA', {
        displayName
      });
    }
    return buttonLabel;
  };

  _renderFieldHeader = (fieldName, displayName) => {
    const { field, direction } = this.props.sorting;
    const headerClass = classNames({
      'sketches-table__header': true,
      'sketches-table__header--selected': field === fieldName
    });
    const buttonLabel = this._getButtonLabel(fieldName, displayName);
    return (
      <th scope="col">
        <button
          className="sketch-list__sort-button"
          onClick={() => this.props.toggleDirectionForField(fieldName)}
          aria-label={buttonLabel}
        >
          <span className={headerClass}>{displayName}</span>
          {field === fieldName &&
            direction === SortingActions.DIRECTION.ASC && (
              <ArrowUpIcon
                role="img"
                aria-label={this.props.t('SketchList.DirectionAscendingARIA')}
                focusable="false"
              />
            )}
          {field === fieldName &&
            direction === SortingActions.DIRECTION.DESC && (
              <ArrowDownIcon
                role="img"
                aria-label={this.props.t('SketchList.DirectionDescendingARIA')}
                focusable="false"
              />
            )}
        </button>
      </th>
    );
  };

  render() {
    const username =
      this.props.username !== undefined
        ? this.props.username
        : this.props.user.username;
    const { mobile } = this.props;
    return (
      <article className="sketches-table-container">
        <Helmet>
          <title>{this.getSketchesTitle()}</title>
        </Helmet>
        {this._renderLoader()}
        {this._renderEmptyTable()}
        {this.hasSketches() && (
          <div className="sketches-grid">
            {this.props.sketches.map((sketch) => (
              <SketchGridItem
                mobile={mobile}
                key={sketch.id}
                sketch={sketch}
                user={this.props.user}
                username={username}
                onAddToCollection={() => {
                  this.setState({ sketchToAddToCollection: sketch });
                }}
                t={this.props.t}
              />
            ))}
          </div>
        )}
        {this.state.sketchToAddToCollection && (
          <Overlay
            isFixedHeight
            title={this.props.t('SketchList.AddToCollectionOverlayTitle')}
            closeOverlay={() =>
              this.setState({ sketchToAddToCollection: null })
            }
          >
            <AddToCollectionList
              project={this.state.sketchToAddToCollection}
              username={this.props.username}
              user={this.props.user}
            />
          </Overlay>
        )}
      </article>
    );
  }
}

SketchList.propTypes = {
  user: PropTypes.shape({
    username: PropTypes.string,
    authenticated: PropTypes.bool.isRequired
  }).isRequired,
  getProjects: PropTypes.func.isRequired,
  sketches: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      createdAt: PropTypes.string.isRequired,
      updatedAt: PropTypes.string.isRequired
    })
  ).isRequired,
  username: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  toggleDirectionForField: PropTypes.func.isRequired,
  resetSorting: PropTypes.func.isRequired,
  sorting: PropTypes.shape({
    field: PropTypes.string.isRequired,
    direction: PropTypes.string.isRequired
  }).isRequired,
  mobile: PropTypes.bool,
  t: PropTypes.func.isRequired
};

SketchList.defaultProps = {
  username: undefined,
  mobile: false
};

function mapStateToProps(state) {
  return {
    user: state.user,
    sketches: getSortedSketches(state),
    sorting: state.sorting,
    loading: state.loading,
    project: state.project
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    Object.assign(
      {},
      ProjectsActions,
      CollectionsActions,
      ToastActions,
      SortingActions
    ),
    dispatch
  );
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(SketchList)
);
