import fetch from 'isomorphic-fetch';
import * as types from '../constants/ActionTypes';

export function updateSSLimit(ssLimit) {
  return {
    type: types.UPDATE_SS_LIMIT,
    ssLimit
  };
}

export function toggleLeader(character, toggle) {
  return {
    type: types.TOGGLE_LEADER,
    character,
    toggle
  };
}

export function toggleFollower(character, toggle) {
  return {
    type: types.TOGGLE_FOLLOWER,
    character,
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

function receiveCharacters(selectedFaction, json) {
  return {
    type: types.RECEIVE_CHARS,
    characters: json.characters,
    selectedFaction
  };
}

function fetchCharacters(selectedFaction) {
  return dispatch => {
    dispatch(requestCharacters(selectedFaction));

    return fetch(`/api/${selectedFaction}/characters`)
      .then(response => response.json())
      .then(json => {
        dispatch(receiveCharacters(selectedFaction, json));
      });
  };
}

function shouldFetchCharacters(state, selectedFaction) {
  const {characters, isFetching} = state.charactersByFaction[selectedFaction];
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
      return dispatch(fetchCharacters(selectedFaction));
    }
  };
}
