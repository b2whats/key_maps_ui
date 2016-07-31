import { getValues } from 'redux-form';
import fromPairs from 'lodash/fp/fromPairs';
import gql from 'graphql-tag';

import capitalize from 'lodash/fp/capitalize';
import find from 'lodash/fp/find';
import keys from 'lodash/fp/keys';
import map from 'lodash/fp/map';
import reduce from 'lodash/fp/reduce';

import { CREATE_MAP_ITEM, FETCH_MAP_ITEMS, REMOVE_MAP_ITEM } from '../lib/types';
import * as api from '../lib/api';


// CREATE
export const createMapItem = (instMap, attributes) => {
  let types;
  let varsMap;

  types = keys(instMap.types);
  types = map(k => `$${k}: ${capitalize(instMap.types[k])}`, types)
  types = [...types, '$map: String'].join(', ');

  varsMap = keys(instMap.types);
  varsMap = map(k => `${k}: $${k}`, varsMap);
  varsMap = [...varsMap, 'map: $map'].join(', ');

  return api.gql.mutate({
    mutation: gql`
      mutation _ (${types}) {
        createMapItem (${varsMap}) {
          id,
          map_id,
          attributes
        }
      }
    `,
    variables: {
      ...attributes,
      map: instMap.name,
    },
  }).then(
    payload => ({ type: CREATE_MAP_ITEM, payload }),
  );
};


// FETCH
export const fetchMapItems = (mapName) => api.gql.query({
  query: gql`
    query _ ($map: String) {
      mapItems(map: $map) {
        id,
        map_id,
        attributes
      }
    }
  `,
  variables: {
    map: mapName,
  },
  forceFetch: true,
}).then(
  payload => ({ type: FETCH_MAP_ITEMS, payload }),
);


// REMOVE
export const removeMapItem = (id) => (dispatch) => {
  dispatch({ type: REMOVE_MAP_ITEM, payload: { id }});

  return api.gql.mutate({
    mutation: gql`
      mutation _ ($id: ID) {
        removeMapItem (id: $id) { id }
      }
    `,
    variables: {
      id,
    },
  });
};


/**
 * Form handlers
 */
export const submitNewMapItemForm = () => (dispatch, getState) => {
  const params = getValues(getState().form['map_items/new']);
  const attributes = reduce((obj, a) => ({ ...obj, [a.key]: a.value }), {})(params.attributes);
  const instMap = find(m => m.id === params.map_id, getState().maps.collection);

  return dispatch(createMapItem(instMap, attributes));
};
