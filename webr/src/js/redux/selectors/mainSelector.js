import { createSelector } from 'reselect';

const mainDataSelector = state => state.main;

const resultSelector = createSelector(
  mainDataSelector,
  payload => payload.get('result2')
);

const resultTabs = createSelector(
  mainDataSelector,
  payload => payload.get('tabs')
);

export const mainSelector = state => ({
    result2: resultSelector(state),
    tabs: resultTabs(state),
});
