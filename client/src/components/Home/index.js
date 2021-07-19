import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import InfiniteScroll from "react-infinite-scroll-component";

import List from './List.js'
import store from '../../store/configureStore.js';
import * as actions from '../../actions';
import './home.css';
import usarmylogo from './usarmy-logo.png';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDescendent: false,
      hasMore: true
    };
  }

  componentDidMount() {
    store.dispatch(actions.getSoldiers());
    store.dispatch(actions.getSuperiors());
  }

  handleReset = () => {
    store.dispatch(actions.reset());
    store.dispatch(actions.getSoldiers());
    this.setState({ hasMore: true })
  };

  handleNameSort = () => {
    store.dispatch(actions.sort('name', this.state.isDescendent));
    store.dispatch(actions.getSoldiers());
    this.setState({
      isDescendent: !this.state.isDescendent
    });
  };

  handleSupSort = () => {
    store.dispatch(actions.sort('superior', this.state.isDescendent));
    store.dispatch(actions.getSoldiers());
    this.setState({
      isDescendent: !this.state.isDescendent
    });
  };

  handleRankSort = () => {
    store.dispatch(actions.sort('rank', this.state.isDescendent));
    store.dispatch(actions.getSoldiers());
    this.setState({
      isDescendent: !this.state.isDescendent
    });
  };

  handleDateSort = () => {
    store.dispatch(actions.sort('startDate', this.state.isDescendent));
    store.dispatch(actions.getSoldiers());
    this.setState({
      isDescendent: !this.state.isDescendent
    });
  };

  handleSearch = e => {
    store.dispatch(actions.search(e.target.value));
    store.dispatch(actions.getSoldiers());
  }

  handleScroll = () => {
    const { currentPage } = this.props.soldiersState;
    if (this.props.soldiers.length >= this.props.superiors.length) {
      this.setState({ hasMore: false });
    }
    setTimeout(() => {
      store.dispatch(actions.scroll(currentPage + 1));
      store.dispatch(actions.getSoldiers());
    }, 300);
  }

  render() {
    return (
      <div>
        <div className='homepage-header'>
          <img src={usarmylogo} alt='logo'
            style={{ width: '200px', height: '200px' }}>
          </img>
          <div style={{ fontSize: 40 }}>
            US Army Personnel Registry
          </div>
        </div>
        <div>
          <div className='flex'>
            <div>
              <Link to='/create'>
                <button className='btn-add'>Add New</button>
              </Link>
              <button className='btn-rst' onClick={this.handleReset}>Reset</button>
            </div>
            <form className='search-form'>
              <input className='input-box'
                type='text'
                name='search'
                placeholder='Search'
                onChange={this.handleSearch}
              />
            </form>
          </div>
          <div>
            <div >
              <table className='tbl-header'>
                <thead>
                  <tr style={{ height: '30px' }}>
                    <th style={{ width: '70px' }}>Avatar</th>
                    <th
                      onClick={this.handleNameSort}
                      style={{ width: '150px' }}
                    >
                      Name
                    </th>
                    <th style={{ width: '100px' }}>Sex</th>
                    <th
                      onClick={this.handleRankSort}
                      style={{ width: '130px' }}
                    >
                      Rank
                    </th>
                    <th
                      onClick={this.handleDateSort}
                      style={{ width: '130px' }}
                    >
                      Start Date
                    </th>
                    <th style={{ width: '130px' }}>Phone</th>
                    <th style={{ width: '150px' }}>Email</th>
                    <th
                      onClick={this.handleSupSort}
                      style={{ width: '150px' }}
                    >
                      Superior
                    </th>
                    <th style={{ width: '70px' }}># of D.S.</th>
                    <th style={{ width: '70px' }}>Edit</th>
                    <th style={{ width: '70px' }}>Delete</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div>
              <InfiniteScroll
                dataLength={this.props.soldiers.length}
                next={this.handleScroll}
                hasMore={this.state.hasMore}
                loader={<h4>Loading...</h4>}
                height={500}
                endMessage={<p><b>Yay! You have seen it all</b></p>
                }
              >
                <table>
                  <tbody className='tbl-body'>
                    {this.props.soldiers.map((item, index) => {
                      return <List key={item._id} {...item} history={this.props.history} />
                    })}
                  </tbody>
                </table>
              </InfiniteScroll>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    soldiersState: state.soldiers,
    soldiers: state.soldiers.soldiersList,
    isSup: state.soldiers.isSup,
    superiors: state.superiors.superiorsList
  };
};

export default connect(mapStateToProps)(Home);