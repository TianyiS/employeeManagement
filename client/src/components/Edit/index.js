import React, { Component } from 'react';
import { connect } from 'react-redux';

import store from '../../store/configureStore.js'
import * as actions from '../../actions';
import './edit.css';

const findIvalidSup = (currentId, soldiersList) => {
  let map = new Map();
  soldiersList.forEach(soldier => {
    map.set(soldier._id, soldier);
  });
  let res = [];
  bfs(currentId, map, res);
  return res;
}

const bfs = (id, map, res) => {
  if(!map.has(id)) {
    return;
  }
  res.push(id);
  let soldier = map.get(id);
  for(let sub of soldier.subordinates) {
    bfs(sub, map, res);
  }
  return;
}

class Edit extends Component {
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
    store.dispatch(actions.getSoldiers());
    store.dispatch(actions.getSuperiors());
  }

  detailsChange = (key, value) => {
    // this.setState({
    //   name: this.props.details.name,
    //   rank: this.props.details.rank,
    //   sex: this.props.details.sex,
    //   startDate: this.props.details.startDate,
    //   phoneNumber: this.props.details.phoneNumber,
    //   email: this.props.details.email,
    //   superior: this.props.details.superior
    // });
    store.dispatch(actions.detailsChange(key, value));
  };

  handleCancel = () => {
    store.dispatch(actions.reset());
    store.dispatch(actions.getSoldiers());
    this.props.history.push('/')
  };

  onSubmit = e => {
    e.preventDefault();

    // let data = new FormData();
    // if (this.state.superior !== '') {
    //   for (let key in this.state) {
    //     data.append(key, this.state[key])
    //   }
    // } else {
    //   for (let key in this.state) {
    //     data.append(key, this.state[key])
    //   }
    //   data.delete('superior');
    // }

    let soldierDetails = {};
    if (this.props.details.superior === '') {
      soldierDetails = {
        name: this.props.details.name,
        rank: this.props.details.rank,
        sex: this.props.details.sex,
        startDate: this.props.details.startDate,
        phoneNumber: this.props.details.phoneNumber,
        email: this.props.details.email
      }
    } else {
      soldierDetails = {
        name: this.props.details.name,
        rank: this.props.details.rank,
        sex: this.props.details.sex,
        startDate: this.props.details.startDate,
        phoneNumber: this.props.details.phoneNumber,
        email: this.props.details.email,
        superior: this.props.details.superior
      }
    }
    store.dispatch(actions.editSoldier(
      this.props.match.params.soldierId,
      soldierDetails,
      // data,
      this.props.history
    ));
  };

  render() {
    return (
      <div className='form-div'>
        <h2>My Profile</h2>
        <form onSubmit={e => this.onSubmit(e)}>
          <div>
            {/* <label>Avatar</label><br /> */}
            <img
              src={`http://localhost:5000/${this.props.details.avastar}`}
              alt='avastar'
              style={{ width: '150px', height: '150px' }}
            />
          </div>
          <div>
            <label>Name:</label><br />
            <input
              type='text'
              name='name'
              value={`${this.props.details.name}`}
              onChange={e => this.detailsChange(e.target.name, e.target.value)}
              required
            />
          </div>
          <div>
            <label>Rank:</label><br />
            <select
              name='rank'
              value={this.props.details.rank}
              onChange={e => this.detailsChange(e.target.name, e.target.value)}
              required
            >
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
              value={this.props.details.sex}
              onChange={e => this.detailsChange(e.target.name, e.target.value)}
              required
            >
              <option value='Male'>Male</option>
              <option value='Female'>Female</option>
            </select>
          </div>
          <div>
            <label>Start Date:</label><br />
            <input
              type='date'
              name='startDate'
              value={`${this.props.details.startDate}`}
              onChange={e => this.detailsChange(e.target.name, e.target.value)}
              required
            />
          </div>
          <div>
            <label>Office Phone:</label><br />
            <input
              type='tel'
              name='phoneNumber'
              value={`${this.props.details.phoneNumber}`}
              onChange={e => this.detailsChange(e.target.name, e.target.value)}
              pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
              required
            />
          </div>
          <div>
            <label>Email:</label><br />
            <input
              type='email'
              name='email'
              value={`${this.props.details.email}`}
              onChange={e => this.detailsChange(e.target.name, e.target.value)}
              required
            />
          </div>
          <div>
            <label>Superior:</label><br />
            <select
              name='superior'
              value={this.props.details.superior ? this.props.details.superior._id : ''}
              onChange={e => this.detailsChange(e.target.name, e.target.value)}
            >
              <option value=''>None</option>
              {this.props.superiors.map((superior => {
                let invalidSup = findIvalidSup(
                  this.props.details._id,
                  this.props.superiors
                );
                if (invalidSup.includes(superior._id)) {
                  return (
                    <option key={superior._id} value={superior._id} disabled>
                      {superior.name}
                    </option>
                  );
                } else {
                  return (
                    <option key={superior._id} value={superior._id}>
                      {superior.name}
                    </option>
                  );
                }
              }))}
            </select>
          </div>
          <div className = 'btn-edit-page'> 
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
    details: state.detail.soldierDetail,
    superiors: state.superiors.superiorsList
  };
};

export default connect(mapStateToProps)(Edit);