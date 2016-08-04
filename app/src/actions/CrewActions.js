import fetch from 'isomorphic-fetch';
import * as types from '../constants/ActionTypes';

export function updateSSLimit(ssLimit) {
  return {
    type: types.UPDATE_SS_LIMIT,
    ssLimit
  };
}

export function toggleLeader(leader, toggle) {
  return {
    type: types.TOGGLE_LEADER,
    leader,
    toggle
  };
}

export function toggleFollower(follower, toggle) {
  return {
    type: types.TOGGLE_FOLLOWER,
    follower,
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
    leaders: json.leaders,
    followers: json.followers,
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
  const {characters} = state.charactersByFaction[selectedFaction];
  console.log(characters);
  if (characters.leaders.length === 0 || characters.followers.length === 0) {
    return true;
  }
  if (characters.isFetching) {
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
