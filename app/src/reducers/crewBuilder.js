import * as types from '../constants/ActionTypes';

const initialState = {
  ssLimit: 0,
  ssCache: 0,
  ssCostSum: 0,
  faction: 'guild'
};

export default function crewBuilder(state = initialState, action) {
  console.log(state);
  switch (action.type) {

    case types.UPDATE_SS_LIMIT:
      return {
        ...state,
        ssLimit: action.ssLimit
      };

    case types.UPDATE_FACTION:
      return {
        ...state,
        faction: action.faction
      };

    default:
      return {
        ...state
      };
  }
}
