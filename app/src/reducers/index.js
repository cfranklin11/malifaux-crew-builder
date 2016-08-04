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

    case types.TOGGLE_LEADER:
      return {
        ...state,
        ssCache: action.toggle === 'add' ?
          parseFloat(action.character.sscache) : 0
      };

    case types.TOGGLE_FOLLOWER:
      return {
        ...state,
        ssCostSum: action.toggle === 'add' ?
          state.ssCostSum + parseFloat(action.character.sscost) :
          state.ssCostSum - parseFloat(action.character.sscost)
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
      faction = action.character.faction.replace(/\s/g, '-').toLowerCase();
      return {
        ...state,
        [faction]: {
          ...state[faction],
          isLeaderAdded: action.toggle === 'add',
          characters: state[faction].characters.map(character => {
            if (character.name === action.character.name) {
              return {...character,
                count: action.toggle === 'add' ?
                  action.character.count + 1 : action.character.count - 1,
                isLeader: action.toggle === 'add'
              };
            }
            return character;
          })
        }
      };

    case types.TOGGLE_FOLLOWER:
      faction = action.character.faction.replace(/\s/g, '-').toLowerCase();
      return {
        ...state,
        [faction]: {
          ...state[faction],
          characters: state[faction].characters.map(character => {
            if (character.name === action.character.name) {
              return {...character,
                count: action.toggle === 'add' ?
                  action.character.count + 1 : action.character.count - 1
              };
            }
            return character;
          })
        }
      };

    default:
      return state;
  }
}

function characters(state = {
  isFetching: false,
  isLeaderAdded: false,
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
        characters: action.characters.map(character => {
          return {...character, count: 0};
        })
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
