const initState = { superiorsList: [] };

const superiors = (state = initState, action) => {
  switch (action.type) {
    case 'FETCH_SUPERIORS_SUCCESS':
      return {
        superiorsList: action.superiors
      };
    default:
      return state;
  }
};

export default superiors;