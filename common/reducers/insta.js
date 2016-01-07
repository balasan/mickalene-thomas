import { GET_INSTA} from '../actions/work'
import { UPDATE_PATH } from 'redux-simple-router'

export default function insta(state = null, action) {
  switch (action.type) {

    case GET_INSTA:
      return state = action.payload.results.body

    default:
      return state
  }
}