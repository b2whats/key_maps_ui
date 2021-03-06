import { createElement } from 'react';
import { reduxForm } from 'redux-form';
import map from 'lodash/fp/map';

import EmptyState from '../EmptyState';
import Loader from '../Loader';
import Form, { FIELDS } from './Form';


/**
 * Render
 */
const New = (props) => (
  <Form
    {...props}
    submitHandler={props.submitNewMapItemForm}
    submitMessage={`Added new item to the map "${props.instMap.name}"`}
    buttonLabel="Add item"
  />
);


const NewForm = reduxForm({
  form: 'map_items/new',
  fields: FIELDS,
}, (state, ownProps) => ({
  initialValues: {
    attributes: map(
      k => ({ type: ownProps.instMap.types[k], key: k, value: undefined }),
      Object.keys(ownProps.instMap.types)
    ),
    map_id: ownProps.instMap.id,
  },
}))(New);


export default (props) => (
  props.instMap ?
    (<NewForm {...props} />) :
    (<EmptyState><Loader /></EmptyState>)
);
