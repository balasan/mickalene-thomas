import { GET_NEWS} from '../actions/work'
import { UPDATE_PATH } from 'redux-simple-router'

export default function news(state = null, action) {
  switch (action.type) {

    case GET_NEWS:
        return state = action.payload.results;

    case UPDATE_PATH:

    default:
      return state
  }
}