import React, { Component } from 'react';
// import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import store from '../../store/configureStore.js';
import * as actions from '../../actions';

class List extends Component {

  componentDidMount() {
    // console.log(this.props.superior);
  }

  handleEditButton = () => {
    store.dispatch(actions.getSoldierDetail(
      this.props._id,
      this.props.history
    ));
  }

  handleDeleteButton = () => {
    store.dispatch(actions.deleteSoldier(
      this.props._id,
      this.props.history
    ));
  }

  handleClickSup = () => {
    if (this.props.superior) {
      store.dispatch(actions.reloadSoldiers());
      store.dispatch(actions.clickSup(this.props._id));
    }
  }

  handleClickSub = () => {
    if (this.props.subordinates.length > 0) {
      store.dispatch(actions.reloadSoldiers());
      store.dispatch(actions.clickSub(this.props._id));
    }
  }

  render() {
    // store.dispatch(actions.getSoldierDetail(this.props._id));
    return (
      <tr>
        <td>
          <img
            src={`http://localhost:5000/${this.props.avastar}`}
            alt='avastar'
            style={{width: '70px', height: '70px'}}
          />
        </td>
        <td style={{ width: '150px' }}>{this.props.name}</td>
        <td style={{ width: '100px' }}>{this.props.sex}</td>
        <td style={{ width: '130px' }}>{this.props.rank}</td>
        <td style={{ width: '130px' }}>{this.props.startDate}</td>
        <td style={{ width: '130px' }}>
          <a href={`tel:${this.props.email}`}>
            {this.props.phoneNumber}
          </a>
        </td>
        <td style={{ width: '150px' }}>
          <a href={`mailto:${this.props.email}`}>
            {this.props.email}
          </a>
        </td>
        <td
          onClick={this.handleClickSup}
          style={{ width: '150px' }}
        >
          {this.props.superior ? this.props.superior.name : ''}
        </td>
        <td
          onClick={this.handleClickSub}
          style={{ width: '70px' }}
        >
          {this.props.subordinates.length === 0 ? '' : this.props.subordinates.length}
        </td>
        <td style={{ width: '70px' }}>
          <button onClick={this.handleEditButton}>
            Edit
          </button>
        </td>
        <td style={{ width: '70px' }}>
          <button onClick={this.handleDeleteButton}>
            Delete
          </button>
        </td>
      </tr>
    );
  }
}

const mapStateToProps = state => {
  return {
    details: state.detail.soldierDetail
  };
};

export default connect(mapStateToProps)(List);