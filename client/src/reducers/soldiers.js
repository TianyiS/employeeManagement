import combineData from './combine.js';

const initState = {
  isLoading: false,
  err: null,
  soldiersList: [],
  isSup: false,
  sortDirection: '',
  sortType: '$natural',
  searchItem: '',
  currentPage: 0,
  skip: 'false'
};

const soldiers = (state = initState, action) => {
  switch (action.type) {
    case 'FETCH_SOLDIERS_REQUEST':
      return {
        ...state,
        isLoading: true
      };
    case 'FETCH_SOLDIERS_FAILURE':
      return {
        ...state,
        isLoading: false,
        err: action.err
      };
    case 'FETCH_SOLDIERS_SUCCESS':
      return {
        ...state,
        isLoading: false,
        err: null,
        soldiersList: combineData(state.soldiersList, action.soldiers, state.skip)
      };
    case 'FETCH_SORT':
      return {
        ...state,
        sortType: action.sortDetail.sortType,
        sortDirection: action.sortDetail.sortDirection,
        skip: 'false'
      };
    case 'FETCH_SEARCH':
      return {
        ...state,
        soldiersList: [],
        searchItem: action.searchItem,
        skip: 'false'
      };
    case 'FETCH_SCROLL_PAGE':
      return {
        ...state,
        currentPage: action.currentPage,
        skip: 'true'
      };

    case 'FETCH_RESET':
      return {
        ...state,
        isLoading: false,
        err: null,
        soldiersList: [],
        isSup: false,
        sortDirection: '',
        sortType: '$natural',
        searchItem: '',
        currentPage: 0,
        skip: 'false'
      };
    case 'FETCH_RELOAD':
      return {
        ...state,
        skip: 'false'
      };
    default:
      return state;
  }
};

export default soldiers;