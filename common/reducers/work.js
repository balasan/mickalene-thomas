import { GET_WORK } from '../actions/work'
import { set } from '../actions/work';
import { loadWork } from '../actions/work';

loadWork();
// set();
// const wtf = load;
console.log(loadWork(), "loadWork");

// const initialState = GET_WORK;

export default function counter(state = 0, action) {
  switch (action.type) {
    case GET_WORK:
      console.log(action.payload, "action.payload")
      return action.payload
    default:
      return state
  }
}
