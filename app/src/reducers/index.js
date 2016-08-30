import {combineReducers} from 'redux';
import * as types from '../constants/ActionTypes';

const initialState = {
  soulstones: {
    ssLimit: 0,
    ssCache: 0,
    ssCostSum: 0
  },
  selectedFaction: 'guild',
  upgrades: [],
  charactersByFaction: {
    guild: {
      isFetching: true,
      isLeaderAdded: false,
      leaderName: '',
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

function upgrades(state = initialState.upgrades, action) {
  switch (action.type) {

    case types.RECEIVE_CHARS:
      return action.upgrades.map(upgrade => {
        return {
          ...upgrade,
          count: 0
        };
      });

    case types.TOGGLE_UPGRADE:
      return action.upgrades.map(upgrade => {
        if (upgrade.name === action.upgrade.name) {
          return {
            ...upgrade,
            count: action.toggle === 'add' ?
              upgrade.count + 1 : upgrade.count - 1
          };
        }
        return upgrade;
      });

    default:
      return state;
  }
}

function charactersByFaction(state = initialState.charactersByFaction,
  action) {
  switch (action.type) {
    case types.RECEIVE_CHARS:
    case types.REQUEST_CHARS:
      return {
        ...state,
        [action.selectedFaction]:
          characters(state[action.selectedFaction], action)
      };

    case types.TOGGLE_LEADER:
      return {
        ...state,
        [action.selectedFaction]: {
          ...state[action.selectedFaction],
          isLeaderAdded: action.toggle === 'add',
          leaderName: action.toggle === 'add' ? action.character.name : '',
          characters: state[action.selectedFaction].characters
            .map(character => {
              if (character.name === action.character.name) {
                return {
                  ...character,
                  count: action.toggle === 'add' ?
                    action.character.count + 1 : action.character.count - 1,
                  isLeader: action.toggle === 'add'
                };
              }
              return character;
            }
          )
        }
      };

    case types.TOGGLE_FOLLOWER:
      return {
        ...state,
        [action.selectedFaction]: {
          ...state[action.selectedFaction],
          characters: state[action.selectedFaction].characters
            .map(character => {
              if (character.name === action.character.name) {
                return {
                  ...character,
                  count: action.toggle === 'add' ?
                    action.character.count + 1 : action.character.count - 1
                };
              }
              return character;
            }
          )
        }
      };

    case types.TOGGLE_UPGRADE:
      return {
        ...state,
        [action.selectedFaction]: {
          ...state[action.selectedFaction],
          characters: state[action.selectedFaction].characters
            .map(character => {
              if (character.name === action.character.name) {
                const {characterUpgrades} = character;
                const upgradeIndex = characterUpgrades.findIndex(upgrade => {
                  return upgrade.name === action.upgrade.name;
                });
                let updatedUpgrades;

                if (action.toggle === 'add') {
                  if (upgradeIndex === -1) {
                    updatedUpgrades = characterUpgrades.concat({
                      ...action.upgrade,
                      count: 1,
                      versions: [action.version]
                    });
                  } else {
                    characterUpgrades.map(upgrade => {
                      return upgrade.name === action.upgrade.name ?
                        {
                          ...upgrade,
                          count: upgrade.count + 1,
                          versions: upgrade.versions.concat(action.version)
                        } : upgrade;
                    });
                  }
                } else if (action.upgrade.count === 1) {
                  if (characterUpgrades.length === 1) {
                    updatedUpgrades = [];
                  } else if (upgradeIndex === 0) {
                    updatedUpgrades = characterUpgrades.slice(1);
                  } else {
                    updatedUpgrades = characterUpgrades
                      .slice(0, upgradeIndex)
                      .concat(characterUpgrades.slice(upgradeIndex + 1));
                  }
                } else {
                  updatedUpgrades = characterUpgrades.map(upgrade => {
                    if (upgrade.name === action.upgrade.name) {
                      const {versions} = upgrade;
                      const versionsIndex = versions.indexOf(action.version);
                      let updatedVersions;

                      if (versionsIndex === 0) {
                        updatedVersions = versions.slice(1);
                      } else {
                        updatedVersions = versions
                          .slice(0, versionsIndex)
                          .concat(versions.slice(versionsIndex + 1));
                      }

                      return {
                        ...upgrade,
                        count: upgrade.count - 1,
                        versions: updatedVersions
                      };
                    }
                    return upgrade;
                  });
                }

                return {
                  ...character,
                  characterUpgrades: updatedUpgrades
                };
              }
              return character;
            }
          )
        }
      };

    default:
      return state;
  }
}

function characters(
  state = {
    isFetching: false,
    isLeaderAdded: false,
    characters: []
  },
  action) {
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
          return {...character, count: 0, characterUpgrades: []};
        })
      };

    default:
      return state;
  }
}

const rootReducer = combineReducers({
  upgrades,
  charactersByFaction,
  soulstones,
  selectedFaction
});

export default rootReducer;
