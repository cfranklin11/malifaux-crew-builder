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

// function crew(state = initialState.crew, action) {
//   switch (action.type) {

//     case types.ADD_LEADER:
//       return {
//         ...state,
//         isLeaderAdded: true,
//         leader: {...action.leader, count: action.leader.count + 1}
//       };

//     case types.ADD_FOLLOWER:
//       return {
//         ...state,
//         followers: [
//           ...state.followers.filter(follower => {
//             return follower.name !== action.follower.name;
//           }),
//           {...action.follower,
//             count: action.follower.count + 1
//           }
//         ]
//       };

//     case types.REMOVE_LEADER:
//       return {
//         ...state,
//         isLeaderAdded: false,
//         leader: {}
//       };

//     case types.REMOVE_FOLLOWER:
//       return {
//         ...state,
//         followers: state.followers.filter(follower => {
//           return follower.name !== action.followerName;
//         })
//       };

//     default:
//       return state;
//   }
// }

function charactersByFaction(state = {}, action) {
  switch (action.type) {

    case types.RECEIVE_CHARS:
    case types.REQUEST_CHARS:
      return {
        ...state,
        [action.selectedFaction]:
          characters(state[action.selectedFaction], action)
      };

    case types.ADD_LEADER:
      return {
        ...state,
        isLeaderAdded: true,
        characters: {
          leaders: [
            ...state.characters.leaders.filter(leader => {
              return leader.name !== action.leader.name;
            }),
            {...action.leader,
              count: action.leader.count + 1
            }
          ],
          followers: state.characters.followers
        }
      };
    case types.ADD_FOLLOWER:
      return {
        ...state,
        characters: {
          followers: [
            ...state.characters.followers.filter(follower => {
              return follower.name !== action.follower.name;
            }),
            {...action.follower,
              count: action.follower.count + 1
            }
          ],
          leaders: state.characters.leaders
        }
      };

    case types.REMOVE_LEADER:
      return {
        ...state,
        isLeaderAdded: false,
        characters: {
          leaders: [
            ...state.characters.leaders.filter(leader => {
              return leader.name !== action.leader.name;
            }),
            {...action.leader,
              count: action.leader.count - 1
            }
          ],
          followers: state.characters.followers
        }
      };
    case types.REMOVE_FOLLOWER:
      return {
        ...state,
        characters: {
          followers: [
            ...state.characters.followers.filter(follower => {
              return follower.name !== action.follower.name;
            }),
            {...action.follower,
              count: action.follower.count - 1
            }
          ],
          leaders: state.characters.leaders
        }
      };

    default:
      return state;
  }
}

function characters(state = {
  isFetching: false,
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
