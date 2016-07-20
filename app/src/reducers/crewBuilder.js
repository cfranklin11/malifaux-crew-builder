import * as types from '../constants/ActionTypes';
import omit from 'lodash/object/omit';
import assign from 'lodash/object/assign';
import mapValues from 'lodash/object/mapValues';
import mapKeys from 'lodash/object/mapKeys';
import findKey from 'lodash/object/findKey';


const initialState = {
  completeCount: 0,
  starCount: 0,
  completedToday: 0,
  addedToday: 0,
  progressToday: 0,
  todos: [1, 2, 3],
  todosById: {
    1: {
      id: 1,
      name: 'Learn how to do stuff.'
    },
    2: {
      id: 2,
      name: 'Learn how to do more stuff.'
    },
    3: {
      id: 3,
      name: 'Learn how to do even more stuff.'
    }
  }
};

export default function todos(state = initialState, action) {
  console.log(state);
  switch (action.type) {

    case types.ADD_TODO:
      const newId = state.todos[state.todos.length - 1] + 1;
      const newKey = state.todos.length + 1;
      return {
        ...state,
        addedToday: state.addedToday + 1,
        progressToday: state.completedToday / (state.addedToday + 1) - 1,
        todos: state.todos.concat(newId),
        todosById: {
          ...state.todosById,
          [newKey]: {
            id: newId,
            name: action.name
          }
        },
      }

    case types.REORDER_ADD:
      return {
        ...state,
        todosById: mapKeys(state.todosById, (value, key, todos) => {
          return parseFloat(key) === state.todos.length ?
            state.todos.length - state.completeCount :
            todos[key].complete ?
              parseFloat(key) + 1 :
              key
        })
      }

    case types.COMPLETE_TODO:
      return {
        ...state,
        starCount: action.starred ? state.starCount - 1 : state.starCount,
        completeCount: action.complete ?
          state.completeCount - 1 : state.completeCount + 1,
        completedToday: action.complete ?
          state.completedToday - 1 : state.completedToday + 1,
        progressToday: state.addedToday ?
          action.complete ?
            (state.completedToday - 1) / state.addedToday - 1:
            (state.completedToday + 1) / state.addedToday - 1:
          action.complete ?
            state.completedToday - 1 :
            state.completedToday + 1,
        todosById: mapValues(state.todosById, todo => {
          return todo.id === action.id ?
            assign({}, todo, { complete: !todo.complete, starred: false }) :
            todo
        })
      }

    case types.REORDER_COMPLETE:
      return {
        ...state,
        todosById: mapKeys(state.todosById, (value, key, todos) => {
          return todos[key].id === action.id ?
            !action.complete ?
              state.todos.length : state.starCount + 1 :
            !action.complete ?
              key < findKey(todos, {'id': action.id}) ?
                key : parseFloat(key) - 1 :
              key < findKey(todos, {'id': action.id}) ?
                todos[key].starred ?
                  key : parseFloat(key) + 1 :
                key
        })
      }

    case types.STAR_TODO:
      return {
        ...state,
        starCount: action.starred ? state.starCount - 1 : state.starCount + 1,
        todosById: mapValues(state.todosById, todo => {
          return todo.id === action.id ?
            assign({}, todo, { starred: !todo.starred }) :
            todo
        })
      }

    case types.REORDER_STAR:
      return {
        ...state,
        todosById: mapKeys(state.todosById, (value, key, todos) => {
          return todos[key].id === action.id ?
            !action.starred ?
                1 : state.starCount + 1 :
            key < findKey(todos, {'id': action.id}) ?
              !action.starred ?
                parseFloat(key) + 1 : key :
              !action.starred ?
                key : todos[key].starred ?
                  parseFloat(key) - 1 : key
        })
      }

    case types.DELETE_TODO:
      return {
        ...state,
        completeCount: action.complete ? state.completeCount - 1 : state.completeCount,
        starCount: action.starred ? state.starCount - 1 : state.starCount,
        todos: state.todos.filter(id => id !== action.id),
        todosById: omit(state.todosById, action.id)
      }

    case types.REORDER_DELETE:
      var i = 0;
      return {
        ...state,
        todosById: mapKeys(state.todosById, (value, key, todos) => {
          i++
          return parseFloat(key) !== i ?
            parseFloat(key) - 1 : key
        })
      }

    default:
      return state;
  }
}
