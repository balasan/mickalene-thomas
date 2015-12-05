import { GET_WORK } from '../actions/work'
import { set } from '../actions/work';
import { loadWork } from '../actions/work';

import { GET_ITEM } from '../actions/work'
import { setitem } from '../actions/work';
import { loadItem } from '../actions/work';
// loadWork();
// set();
// const wtf = load;
// console.log(loadWork(), "loadWork");

// const initialState = GET_WORK;

export default function getwork(state = null, action) {
  switch (action.type) {
    case GET_WORK:
      return Object.assign({}, state, {
        all: action.payload
      })
    case GET_ITEM:
      return Object.assign({}, state, {
        currentitem: action.payload
      })
    default:
      return state
  }
}

// export default function getitem(state = null, action) {
//   switch (action.type) {
//     case GET_ITEM:
//       // console.log(action.payload, "action.payload")
//       return action.payload
//     default:
//       return state
//   }
// }
