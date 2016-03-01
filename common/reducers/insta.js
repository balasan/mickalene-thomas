import { GET_INSTA} from '../actions/work'
import { UPDATE_PATH } from 'redux-simple-router'

export default function insta(state = [], action) {
  switch (action.type) {

    case GET_INSTA:
      console.log(action.payload.results.body, 'insta action');
      return state = action.payload.results.body;

    default:
      return state
  }
}
