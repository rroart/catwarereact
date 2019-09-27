import { put, fork, takeLatest, takeEvery } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { constants as mainConstants, actions as mainActions } from '../modules/main';
import { Tabs, Tab } from 'react-bootstrap';

import type { mainType } from '../../common/types/main'

export function* fetchMainData() {
    // pretend there is an api call
    const result: mainType = {
	title: 'Myweb',
	description: __CONFIG__.description,
	source: 'This message is coming from Redux',
    };

    yield put(mainActions.updateMain(result));
}

export function* getNewTab() {
    const result = new Tab();
    yield put(mainActions.newtabMain(result));
}

function* watchGetMain() {
    yield takeLatest(mainConstants.GET_MAIN, fetchMainData);
}

function* watchNewTabMain() {
}

export const mainSaga = [
    fork(watchGetMain),
    fork(watchNewTabMain),
];
