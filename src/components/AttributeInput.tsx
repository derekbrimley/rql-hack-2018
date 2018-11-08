import React, { Component } from 'react';
import '../App.css';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { EField } from '../App';
import rqlMetadata from '../rql_metadata.json';

interface IAttributeInput {
  field: string
  value: string
  onChange: (ev) => void
}
const getQualifiers = (field) => Object.keys(rqlMetadata[field].qualifiers)

const AttributeInput: React.SFC<IAttributeInput> = props => {
  const qualifiers = getQualifiers(props.field)
  return (
    <Select
      className='input'
      onChange={props.onChange}
      value={props.value}
    >
      {qualifiers.map(qualifier => (
        <MenuItem key={qualifier} value={qualifier}>{qualifier}</MenuItem>
      ))}
    </Select>
  );
}

export default AttributeInput;