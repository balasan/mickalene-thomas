import { GET_WORK } from '../actions/work'

export default function counter(state = 0, action) {
  switch (action.type) {
    case GET_WORK:
      return action.payload
    default:
      return state
  }
}
