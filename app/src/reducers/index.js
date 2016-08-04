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
      isLeaderAdded: false,
      characters: {
        leaders: [],
        followers: []
      }
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

function charactersByFaction(
  state = initialState.charactersByFaction,
  action) {
  let faction;

  switch (action.type) {
    case types.RECEIVE_CHARS:
    case types.REQUEST_CHARS:
      return {
        ...state,
        [action.selectedFaction]:
          characters(state[action.selectedFaction], action)
      };

    case types.TOGGLE_LEADER:
      faction = action.leader.faction.replace(/\s/g, '-').toLowerCase();
      return {
        ...state,
        [faction]: {
          ...state[faction],
          isLeaderAdded: action.toggle === 'add',
          characters: {
            ...state[faction].characters,
            leaders: state[faction].characters.leaders.map(leader => {
              if (leader.name === action.leader.name) {
                return {...leader,
                  count: action.toggle === 'add' ?
                    action.leader.count + 1 : action.leader.count - 1
                };
              }
              return leader;
            })
          }
        }
      };
    case types.TOGGLE_FOLLOWER:
      faction = action.follower.faction.replace(/\s/g, '-').toLowerCase();
      return {
        ...state,
        [faction]: {
          ...state[faction],
          characters: {
            ...state[faction].characters,
            followers: state[faction].characters.followers.map(follower => {
              if (follower.name === action.follower.name) {
                return {...follower,
                  count: action.toggle === 'add' ?
                    action.follower.count + 1 : action.follower.count - 1
                };
              }
              return follower;
            })
          }
        }
      };

    default:
      return state;
  }
}

function characters(state = {
  isFetching: false,
  isLeaderAdded: false,
  characters: {
    leaders: [],
    followers: []
  }
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
        characters: {
          leaders: action.leaders.map(leader => {
            return {...leader, count: 0};
          }),
          followers: action.followers.map(follower => {
            return {...follower, count: 0};
          })
        }
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
