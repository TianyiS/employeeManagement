const axios = require('axios');

const getSoldiersStart = () => {
  return {
    type: 'FETCH_SOLDIERS_REQUEST'
  };
};

const getSoldiersFail = (error) => {
  return {
    type: 'FETCH_SOLDIERS_FAILURE',
    err: error
  };
};

const getSoldiersSuccess = (response) => {
  return {
    type: 'FETCH_SOLDIERS_SUCCESS',
    soldiers: response
  };
};

const getDetailStart = () => {
  return {
    type: 'FETCH_DETAIL_REQUEST'
  };
};

const getDetailFail = (error) => {
  return {
    type: 'FETCH_DETAIL_FAIL',
    err: error
  };
};

const getDetailSuccess = (response) => {
  return {
    type: 'FETCH_DETAIL_SUCCESS',
    detail: response
  };
};

export const getSoldiers = () => {
  return (dispatch, getState) => {
    const { soldiers } = getState();
    const {
      sortDirection,
      sortType,
      searchItem,
      currentPage,
      skip
    } = soldiers;
    dispatch(getSoldiersStart());
    axios
      .get(`http://127.0.0.1:5000/api/soldiers?search=${searchItem}&sortDirection=${sortDirection}&sortType=${sortType}&page=${currentPage}&skip=${skip}`)
      .then(response => {
        dispatch(getSoldiersSuccess(response.data.soldiers));
      })
      .catch(err => {
        dispatch(getSoldiersFail(err));
      });
  };
};

export const getSuperiors = () => {
  return (dispatch, getState) => {
    axios
      .get('http://127.0.0.1:5000/api/superiors')
      .then(response => {
        dispatch(getSuperiorsSuccess(response.data.superiors));
      })
      .catch(err => {
        dispatch(getSoldiersFail(err));
      });
  };
};

const getSuperiorsSuccess = (response) => {
  return {
    type: 'FETCH_SUPERIORS_SUCCESS',
    superiors: response
  };
};

export const getSoldierDetail = (id, history) => {
  return (dispatch, getState) => {
    dispatch(getDetailStart());
    axios
      .get(`http://127.0.0.1:5000/api/soldier/${id}`)
      .then(response => {
        dispatch(getDetailSuccess(response.data.soldier));
        history.push(`/edit/${id}`)
      })
      .catch(err => {
        dispatch(getDetailFail(err));
      });
  };
};

export const addSoldier = (detail, history) => {
  return (dispatch, getState) => {
    axios
      .post('http://127.0.0.1:5000/api/soldier', detail)
      .then(response => {
        dispatch(getSoldiersSuccess(response.data.soldiers));
        // dispatch(reset());
        // dispatch(getSoldiers());
        history.push('/');
      })
      .catch(err => {
        dispatch(getSoldiersFail(err));
      });
  };
};

export const editSoldier = (id, detail, history) => {
  return (dispatch, getState) => {
    axios
      .put(`http://127.0.0.1:5000/api/soldier/${id}`, detail)
      .then(response => {
        dispatch(reloadSoldiers());
        dispatch(getSoldiersSuccess(response.data.soldiers));
        // dispatch(reset());
        // dispatch(getSoldiers());
        history.push('/');
      })
      .catch(err => {
        dispatch(getSoldiersFail(err));
      });
  };
};

export const deleteSoldier = (id, history) => {
  return (dispatch, getState) => {
    axios
      .delete(`http://127.0.0.1:5000/api/soldier/${id}`)
      .then(response => {
        dispatch(reloadSoldiers());
        dispatch(getSoldiers());
      })
      .catch(err => {
        dispatch(getSoldiersFail(err));
      });
  };
};

export const clickSup = id => {
  return (dispatch, getState) => {
    axios
      .get(`http://127.0.0.1:5000/api/soldier/${id}`)
      .then(response => {
        let superior = [];
        superior.push(response.data.soldier.superior);
        dispatch(getSoldiersSuccess(superior));
      })
      .catch(err => {
        dispatch(getSoldiersFail(err));
      });
  };
};

export const clickSub = id => {
  return (dispatch, getState) => {
    axios
      .get(`http://127.0.0.1:5000/api/soldier/${id}`)
      .then(response => {
        let subordinates = response.data.soldier.subordinates;
        dispatch(getSoldiersSuccess(subordinates));
      })
      .catch(err => {
        dispatch(getSoldiersFail(err));
      });
  };
};

export const detailsChange = (key, value) => {
  return {
    type: 'FETCH_DETAIL_CHANGE',
    detailChange: { [key]: value }
  };
};

export const sort = (key, direct) => {
  return {
    type: 'FETCH_SORT',
    sortDetail: {
      sortType: key,
      sortDirection: direct ? -1 : 1
    }
  };
};

export const reset = () => {
  return {
    type: 'FETCH_RESET'
  }
}

export const search = (item) => {
  return {
    type: 'FETCH_SEARCH',
    searchItem: item
  };
};

export const scroll = (page) => {
  return {
    type: 'FETCH_SCROLL_PAGE',
    currentPage: page
  };
};

export const reloadSoldiers = () => {
  return {
    type: 'FETCH_RELOAD'
  };
};
