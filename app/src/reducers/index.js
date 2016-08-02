import {combineReducers} from 'redux';
import * as types from '../constants/ActionTypes';

const initialState = {
  soulstones: {
    ssLimit: 0,
    ssCache: 0,
    ssCostSum: 0,
    test: [1, 2, 3, 4, 5]
  },
  selectedFaction: 'guild',
  crew: {
    leader: {},
    followers: []
  },
  charactersByFaction: {
    guild: {
      isFetching: true,
      leaders: [],
      followers: []
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

function selectedFaction(state = initialState.selectedFaction, action) {
  switch (action.type) {

    case types.SELECT_FACTION:
      return action.selectedFaction;

    default:
      return state;
  }
}

function crew(state = initialState.crew, action) {
  switch (action.type) {

    case types.ADD_LEADER:
      return {
        ...state,
        leader: action.leader
      };

    case types.ADD_FOLLOWER:
      return {
        ...state,
        followers: [...state.followers, action.follower]
      };

    default:
      return state;
  }
}

function charactersByFaction(state = {}, action) {
  switch (action.type) {

    case types.RECEIVE_CHARS:
    case types.REQUEST_CHARS:
      return {
        ...state,
        [action.selectedFaction]:
          characters(state[action.selectedFaction], action)
      };

    default:
      return state;
  }
}

function characters(state = {
  isFetching: false,
  leaders: [],
  followers: []
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
        followers: action.followers
      };

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  charactersByFaction,
  soulstones,
  selectedFaction,
  crew
});

export default rootReducer;
