import React from 'react';
import '../App.css';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { EField } from '../App';
import rqlMetadata from '../rql_metadata.json';

interface IValueTypeInput {
  field: string
  attribute: string
  operator: string
  value: string
  onChange: (ev) => void
}
const getValueTypes = (field, attribute, operator) => {
  return rqlMetadata[field].qualifiers[attribute][operator][0].map(t => t.type)
}
const ValueTypeInput: React.SFC<IValueTypeInput> = props => {
  const valueTypes = getValueTypes(props.field, props.attribute, props.operator)
  console.log(valueTypes)
  return (
    valueTypes.length > 1 && (
      <>
        <span className='text'>the</span>
        <Select
          className='input'
          onChange={props.onChange}
          value={props.value}
        >
          {valueTypes.map(type => (
            <MenuItem key={type} value={type}>{type}</MenuItem>
          ))}
        </Select>
      </>
    )
  )
}

export default ValueTypeInput;