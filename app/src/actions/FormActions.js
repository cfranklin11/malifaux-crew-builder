import * as types from '../constants/ActionTypes';

export function addTodo(name) {
  return [
    {
      type: types.ADD_TODO,
      name
    },
    {
      type: types.REORDER_ADD
    }
  ];
};