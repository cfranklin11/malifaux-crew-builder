import {combineReducers} from 'redux';
import * as types from '../constants/ActionTypes';

const initialState = {
  soulstones: {
    ssLimit: 0,
    ssCache: 0,
    ssCostSum: 0
  },
  selectedFaction: 'guild',
  charactersByFaction: {
    guild: {
      isFetching: true,
      leaders: [],
      characters: []
    }
  }
};

function soulstones(state = initialState.soulstones, action) {
  switch (action.type) {

    case types.UPDATE_SS_LIMIT:
      return {
        ...state,
        ssLimit: action.ssLimit
      };

    default:
      return state;
  }
}

function selectedFaction(state = 'guild', action) {
  switch (action.type) {

    case types.SELECT_FACTION:
      return action.faction;

    default:
      return state;
  }
}

function charactersByFaction(state = {}, action) {
  switch (action.type) {

    case types.RECEIVE_CHARS:
      return state;

    case types.REQUEST_CHARS:
      return {
        ...state,
        [action.faction]:
          characters(state[action.faction], action)
      };

    default:
      return state;
  }
}

function characters(state = {
  isFetching: false,
  leaders: [],
  characters: []
}, action) {
  switch (action.type) {

    case types.REQUEST_CHARS:
      return {
        ...state,
        isFetching: true
      };

    case types.RECEIVE_CHARS:
      return {
        ...state,
        isFetching: false,
        leaders: action.leaders,
        characters: action.characters
      };

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  charactersByFaction,
  soulstones,
  selectedFaction
});

export default rootReducer;
