import React, { Component } from 'react';
import { connect } from 'react-redux';

import store from '../../store/configureStore.js'
import * as actions from '../../actions';
import './create.css';

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      rank: '',
      sex: '',
      startDate: '',
      phoneNumber: '',
      email: '',
      superior: '',
      avastar: '',
      viewAvastar: ''
    };
  }

  componentDidMount() {
    store.dispatch(actions.getSuperiors());
    store.dispatch(actions.getSoldiers());
  }

  nameChange = e => {
    this.setState({ name: e.target.value });
  };

  rankChange = e => {
    this.setState({ rank: e.target.value });
  };

  sexChange = e => {
    this.setState({ sex: e.target.value });
  };

  startDateChange = e => {
    this.setState({ startDate: e.target.value });
  };

  phoneNumberChange = e => {
    this.setState({ phoneNumber: e.target.value });
  };

  emailChange = e => {
    this.setState({ email: e.target.value });
  };

  superiorChange = e => {
    this.setState({ superior: e.target.value });
  };

  fileChange = e => {
    let value = e.target.files[0];
    let view = URL.createObjectURL(e.target.files[0])
    this.setState({
      avastar: value,
      viewAvastar: view
    });
  };

  handleCancel = () => {
    store.dispatch(actions.reset());
    store.dispatch(actions.getSoldiers());
    this.props.history.push('/')
  };

  onSubmit = e => {
    e.preventDefault();
    let data = new FormData();
    if (this.state.superior !== '') {
      for (let key in this.state) {
        data.append(key, this.state[key])
      }
    } else {
      for (let key in this.state) {
        data.append(key, this.state[key])
      }
      data.delete('superior');
    }
    store.dispatch(actions.addSoldier(data, this.props.history));
  };

  render() {
    return (
      <div className='form-div'>
        <h2>Welcome to Our System!</h2>
        <form onSubmit={e => this.onSubmit(e)}>
          <label>This is me:</label><br />
          {/* <div>
            <label>Avastar</label><br/>
            <img
              src = {this.state.avastar === '' ? 'http://localhost:5000/uploads/2020-02-13T01:09:09.476Z145.jpeg' : this.state.viewAvastar}
              alt = 'please upload your img'
              style={{ width: '120px', height: '120px' }}
            />
          </div> */}
          <div>
            <input
              type='file'
              name='avaster'
              onChange={this.fileChange}
            />
          </div>
          <div>
            <label>Name:</label><br />
            <input
              type='text'
              name='name'
              value={this.state.name}
              onChange={this.nameChange}
              required
            />
          </div>
          <div>
            <label>Rank:</label><br />
            <select
              name='rank'
              value={this.state.rank}
              onChange={this.rankChange}
              required
            >
              <option></option>
              <option value='General'>General</option>
              <option value='Colonel'>Colonel</option>
              <option value='Major'>Major</option>
              <option value='Captian'>Captian</option>
              <option value='Lieutenant'>Lieutenant</option>
              <option value='Warrant Officer'>Warrant Officer</option>
              <option value='Sergeant'>Sergeant</option>
              <option value='Corporal'>Corporal</option>
              <option value='Specialist'>Specialist</option>
              <option value='Private'>Private</option>
            </select>
          </div>
          <div>
            <label>Sex:</label><br />
            <select
              name='sex'
              value={this.state.sex}
              onChange={this.sexChange}
              required
            >
              <option></option>
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
            </select>
          </div>
          <div>
            <label>Start Date:</label><br />
            <input
              type='date'
              name='startDate'
              value={this.state.startDate}
              onChange={this.startDateChange}
              required
            />
          </div>
          <div>
            <label>Office Phone:</label><br />
            <input
              type='tel'
              name='phoneNumber'
              value={this.state.phoneNumber}
              onChange={this.phoneNumberChange}
              pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
              required
            />
          </div>
          <div>
            <label>Email:</label><br />
            <input
              type='email'
              name='email'
              value={this.state.email}
              onChange={this.emailChange}
              required
            />
          </div>
          <div>
            <label>Superior:</label><br />
            <select
              name='superior'
              value={this.state.superior}
              onChange={this.superiorChange}
            >
              <option value={''}>None</option>
              {this.props.superiors.map((superior) => {
                return (
                  <option key={superior._id} value={superior._id}>
                    {superior.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className='btn-create-page'>
            <button type='submit'>Save</button>
            <button onClick={this.handleCancel}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    soldiers: state.soldiers.soldiersList,
    superiors: state.superiors.superiorsList
  };
};

export default connect(mapStateToProps)(Create);