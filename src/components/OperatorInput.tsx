import React from 'react';
import '../App.css';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import 'react-month-picker-input/dist/react-month-picker-input.css';
import { EField } from '../App';
import rqlMetadata from '../rql_metadata.json';
interface IOperatorInput {
  field: string
  attribute: string
  value: string
  onChange: (ev) => void
}
const getOperators = (field, attribute) => Object.keys(rqlMetadata[field].qualifiers[attribute])
const OperatorInput: React.SFC<IOperatorInput> = props => {
  const operators = getOperators(props.field, props.attribute);
  return (
    (props.field !== 'date' && props.field !== 'ingested') ? (
      <>
      <span className='text'>that</span>
        <Select
          className='input'
          onChange={props.onChange}
          value={props.value}
        >
          {operators.map(operator => {
            switch(operator) {
              case 'COLON':
                return <MenuItem key='COLON' value="COLON">partially matches</MenuItem>
              case 'EQUALS':
                return <MenuItem key='EQUALS' value="EQUALS">matches exactly</MenuItem>
              case 'LT':
                return <MenuItem key='LT' value="LT">less than</MenuItem>
              case 'GT':
                return <MenuItem key='GT' value="GT">greater than</MenuItem>
              case 'LTE':
                <MenuItem key='LTE' value="LTE">less than or equal to</MenuItem>
              case 'GTE':
                return <MenuItem key='GTE' value="GTE">greater than or equal to</MenuItem>
            }
          })}
        </Select>
      </>
    ) : null
  )
}

export default OperatorInput;