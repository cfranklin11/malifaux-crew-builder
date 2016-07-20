import * as types from '../constants/ActionTypes';

export function updateSSLimit(ssLimit) {
  return {
    type: types.UPDATE_SS_LIMIT,
    ssLimit
  };
}
