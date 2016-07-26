import fetch from 'isomorphic-fetch';
import * as types from '../constants/ActionTypes';

export function updateSSLimit(ssLimit) {
  return {
    type: types.UPDATE_SS_LIMIT,
    ssLimit
  };
}

export function selectFaction(faction) {
  return {
    type: types.SELECT_FACTION,
    faction
  };
}

function requestCharacters(faction) {
  return {
    type: types.REQUEST_CHARS,
    faction
  };
}

function receiveCharacters(characters) {
  return {
    type: types.RECEIVE_CHARS,
    characters
  };
}

function fetchCharacters(faction) {
  return dispatch => {
    dispatch(requestCharacters(faction));

    return fetch(`/api/${faction}/characters`)
      .then(response => response.json())
      .then(json => dispatch(receiveCharacters(faction, json)));
  };
}

function shouldFetchCharacters(state, faction) {
  const characters = state.charactersByFaction[faction];
  if (!characters) {
    return true;
  }
  if (characters.isFetching) {
    return false;
  }
  return true;
}

export function fetchCharactersIfNeeded(faction) {
  return (dispatch, getState) => {
    if (shouldFetchCharacters(getState(), faction)) {
      return dispatch(fetchCharacters(faction));
    }
  };
}
