const initState = { isLoding: false, soldierDetail: {}, err: null };

const detail = (state = initState, action) => {
  switch (action.type) {
    case 'FETCH_DETAIL_REQUEST':
      return {
        ...state,
        isLoding: true
      };
    case 'FETCH_DETAIL_SUCCESS':
      return {
        ...state,
        isLoding: false,
        err: null,
        soldierDetail: action.detail
      };
    case 'FETCH_DETAIL_FAILURE':
      return {
        isLoding: false,
        err: action.err
      };
    case 'FETCH_DETAIL_CHANGE':
      return {
        ...state,
        soldierDetail: {
          ...state.soldierDetail,
          ...action.detailChange
        }
      };
    default:
      return state;
  }
};

export default detail;