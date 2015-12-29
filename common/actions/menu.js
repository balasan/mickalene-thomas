export const TOGGLE = 'TOGGLE';
export const TOGGLE_LINKS = 'TOGGLE_LINKS';
export const TOGGLE_NAV = 'TOGGLE_NAV';
export const GET_MENU = 'GET_MENU';
export const SET_FILTER = 'SET_FILTER';
export const HIDE_MENU = 'HIDE_MENU';
export const SHOW_ALL = 'SHOW_ALL';
export const SHOW_FILTERED = 'SHOW_FILTERED';

export function toggle() {
  console.log("toggle")
  return {
    type: TOGGLE
  };
}

export function toggleLinks() {
  console.log("toggleLinks")
  return {
    type: TOGGLE_LINKS
  };
}

export function toggleNav() {
  console.log("toggleNav")
  return {
    type: TOGGLE_NAV
  };
}


function showFiltered() {
  return {
    type: SHOW_FILTERED
  };
}

function showAll() {
  return {
    type: SHOW_ALL
  };
}

function hideMenu() {
  return {
    type: HIDE_MENU
  };
}

export function showFilteredX() {
  return dispatch => {
    setTimeout(() => {
      dispatch(showFiltered());
    }, 500);
  };
}

export function showAllX() {
  return dispatch => {
    setTimeout(() => {
      dispatch(showAll());
    }, 500);
  };
}

export function showAllMenu() {
  return dispatch => {
    setTimeout(() => {
      dispatch(showAll());
      dispatch(hideMenu());
    }, 500);
  };
}



export function set(value, length) {
  return {
    type: GET_MENU,
    payload: value,
    length: length
  };
}

export function loadMenu(path) {
  return {
    type: GET_MENU,
    payload: null,
    length: path
  };
}
