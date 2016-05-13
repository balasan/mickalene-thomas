import { GET_INSTA} from '../actions/work'
import { UPDATE_PATH } from 'redux-simple-router'

var initialState = {
  data: [],
  next: null
};

function combineArrays(old, newArr) {
  var combinedArr = old.concat(newArr);
  //console.log(combinedArr, 'cobined arr');
  return combinedArr;
}

export default function insta(state = initialState, action) {
  switch (action.type) {

    case GET_INSTA:
    //console.log(state, 'state')
      return Object.assign({}, state, {
        data: combineArrays(state.data, action.payload.results),
        next: action.payload.next
      })

    default:
      return state
  }
}
