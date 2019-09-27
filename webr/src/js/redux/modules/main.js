import { createAction, handleActions } from 'redux-actions';
import { Map } from 'immutable';

import type { mainType } from '../../common/types/main'
import { Tabs, Tab } from 'react-bootstrap';

const GET_MAIN = 'app/main/GET_MAIN';
const UPDATE_MAIN = 'app/main/UPDATE_MAIN';
const NEWTAB_MAIN = 'app/main/NEWTAB_MAIN';

export const constants = {
    GET_MAIN,
    UPDATE_MAIN,
    NEWTAB_MAIN,
};

// ------------------------------------
// Actions
// ------------------------------------
export const getAwesomeCode = createAction(GET_MAIN, () => ({}));
export const updateMain = createAction(UPDATE_MAIN, (result2 : mainType) => ({ result2 }));
export const newtabMain = createAction(NEWTAB_MAIN, (par) => ( par ) );

export const actions = {
    getAwesomeCode,
    updateMain,
    newtabMain,
};

export const reducers = {
    [UPDATE_MAIN]: (state, { payload }) =>
	state.merge({
	    ...payload,
	}),
    [NEWTAB_MAIN]: (state, { payload }) =>
	state.set({
	    tabs: gettabs4(state, payload)
	})
    ,
}

function gettabs(state) {
    console.log("state0");
    console.log(state);
    var arr = (state.get('tabs'));
    var arrayLength = arr.length;
    arr.push('newTab'+arrayLength);
    console.log("state1");
    console.log(state);
    return arr;
}

function gettabs4(state, payload) {
    console.log("state0");
    console.log(state);
    var arr = (state.get('tabs'));
    console.log(arr);
    var arrayLength = arr.length;
    var newpay = payload + arrayLength;
    arr.push(newpay);
    console.log("state1");
    console.log(state);
    console.log(arr);
    return arr;
}

export const initialState = () =>
    Map({
	result: '',
	tabs: [],
    })

export default handleActions(reducers, initialState());
