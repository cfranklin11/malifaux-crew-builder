import * as types from '../constants/ActionTypes';

const initialState = {
  ssLimit: 0
};

export default function crewBuilder(state = initialState, action) {

  console.log(state);

  switch (action.type) {

    case types.UPDATE_SS_LIMIT:
      return {
        ...state,
        ssLimit: action.ssLimit
      };
  }
}
