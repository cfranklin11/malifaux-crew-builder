import fetch from 'isomorphic-fetch';
import * as types from '../constants/ActionTypes';

export function updateSSLimit(ssLimit) {
  return {
    type: types.UPDATE_SS_LIMIT,
    ssLimit
  };
}

export function toggleLeader(character, selectedFaction, toggle) {
  return {
    type: types.TOGGLE_LEADER,
    character,
    selectedFaction,
    toggle
  };
}

export function toggleFollower(character, selectedFaction, toggle) {
  return {
    type: types.TOGGLE_FOLLOWER,
    character,
    selectedFaction,
    toggle
  };
}

export function toggleUpgrade(
  upgrades, upgrade, character, selectedFaction, toggle) {
  return {
    type: types.TOGGLE_UPGRADE,
    upgrades,
    upgrade,
    character,
    selectedFaction,
    toggle
  };
}

export function selectFaction(selectedFaction) {
  return {
    type: types.SELECT_FACTION,
    selectedFaction
  };
}

function requestCharacters(selectedFaction) {
  return {
    type: types.REQUEST_CHARS,
    selectedFaction
  };
}

function receiveCharacters(state, selectedFaction, json) {
  return {
    type: types.RECEIVE_CHARS,
    characters: json.characters,
    upgrades: json.upgrades || state.upgrades,
    selectedFaction
  };
}

function fetchCharacters(state, selectedFaction) {
  return dispatch => {
    dispatch(requestCharacters(selectedFaction));

    return fetch(`/api/${selectedFaction}/characters`)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveCharacters(state, selectedFaction, json));
      });
  };
}

function shouldFetchCharacters(state, selectedFaction) {
  const {characters, isFetching} = state.charactersByFaction[selectedFaction] ||
    {characters: [], isFetching: false};
  if (!characters) {
    return true;
  }
  if (characters.length === 0) {
    return true;
  }
  if (isFetching) {
    return false;
  }
  return true;
}

export function fetchCharactersIfNeeded(selectedFaction) {
  return (dispatch, getState) => {
    if (shouldFetchCharacters(getState(), selectedFaction)) {
      return dispatch(fetchCharacters(getState(), selectedFaction));
    }
  };
}
