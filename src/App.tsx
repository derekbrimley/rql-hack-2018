import React from 'react';
import './App.css';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import format from 'date-fns/format';
import 'react-month-picker-input/dist/react-month-picker-input.css';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import ValueInput from './components/ValueInput';
import AttributeInput from './components/AttributeInput';
import OperatorInput from './components/OperatorInput';
import ValueTypeInput from './components/ValueTypeInput';
import PlusIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Delete';

import rqlMetadata from './rql_metadata.json';
import Paper from '@material-ui/core/Paper';

const fieldMap = {
  event: 'Event',
  content: 'Content',
  rawcontent: 'Raw Content',
  subject: 'Subject',
  body: 'Body',
  rawbody: 'Rawbody',
  entity: 'Entity',
  attribute: 'Attribute',
  context: 'Context',
  date: 'Date',
  ingested: 'Ingested',
  mode: 'Mode',
  label: 'Label',
  reviewed: 'Reviewed',
  feature: 'Feature',
  model: 'Model',
  trader: 'Trader',
  security: 'Security',
  portfolioManager: 'Portfolio Manager',
  file: 'File',
  sender: 'Sender',
  recipient: 'Recipient',
  modifier: 'Modifier',
  origin: 'Origin',
  originDevice: 'Origin Device',
  destination: 'Destination',
  destinationDevice: 'Destination Device',
  rawSearch: 'Raw Search',
}

export enum EField {
  Date = 'date',
  Content = 'content',
  Subject = 'subject',
  File = 'file'
}
export enum EValueType {
  String = 'string',
  Lexicon = 'lexicon',
  Date = 'date',
  count = 'count',
  filesize = 'filesize'
}
interface IProps {
  updateLine: (line: string) => void
}
interface IRqlBuilderState {
  field: string
  attribute: string
  operator: string
  valueType: string
  value: string | number | Date | [Date, Date]
  
  editableRqlString: string
  dateType: string
}
class RQLBuilder extends React.Component<IProps, IRqlBuilderState> {
  state: IRqlBuilderState = {
    field: 'event',
    attribute: 'id',
    operator: 'EQUALS',
    valueType: 'string',
    value: '',
    editableRqlString: '',
    dateType: 'day'
  }
  componentDidMount() {
    this.props.updateLine(this.buildRqlString())
  }
  handleChange = (name, value): void => {
    if (name === 'field') {
      this.setState({
        value: '',
        attribute: rqlMetadata[value].default,
        operator: Object.keys(rqlMetadata[value].qualifiers[rqlMetadata[value].default])[0],
        valueType: rqlMetadata[value].qualifiers[rqlMetadata[value].default][Object.keys(rqlMetadata[value].qualifiers[rqlMetadata[value].default])[0]][0][0].type
      })
      //Object.keys(rqlMetadata[value].qualifiers[rqlMetadata[value].default])[0][0][0]
      //rqlMetadata[field].qualifiers[attribute][operator][0].map(t => t.type)
    }
    if (name === 'attribute') {
      this.setState({
        operator: Object.keys(rqlMetadata[this.state.field].qualifiers[value])[0],
        valueType: rqlMetadata[this.state.field].qualifiers[value][Object.keys(rqlMetadata[this.state.field].qualifiers[value])[0]][0][0].type
      })
    }
    if (name === 'valueType') {
      this.setState({ value: '' })
    }
    if (name === 'field' && (value === 'date' || value === 'ingested')) {
      this.setState({ value: new Date() })
    }
    if (name === 'attribute' && value === 'between') {
      this.setState({ value: [new Date(), new Date()] })
    }
    if ((name === 'attribute') && (value === 'before' || value === 'after' || value === 'on')) {
      this.setState({ value: new Date() })
    }
    this.setState({ [name]: value } as Pick<IRqlBuilderState, keyof IRqlBuilderState>, () => {
      this.props.updateLine(this.buildRqlString())
    })
  }
  buildRqlString = () => {
    return `${this.state.field}`
    + `.${this.state.attribute}`
    + `${this.buildOperator(this.state.operator)}`
    + `${this.buildValue(this.state.value, this.state.valueType, this.state.operator)}`
  }
  buildValue = (val, type, operator) => {
    switch (type) {
      case 'string':
        return `"${val}"`
      case 'lexicon':
        return `{${val}}`
      case 'datetime':
        switch (this.state.dateType) {
          case 'year':
            return format(val, 'YYYY')
          case 'month':
            return format(val, 'YYYY/MM')
          case 'day':
            return format(val, 'YYYY/MM/d')
        }
      case 'datetime-range':
        switch (this.state.dateType) {
          case 'year':
            return `[${format(val[0], 'YYYY')} TO ${format(val[1], 'YYYY')}]`
          case 'month':
            return `[${format(val[0], 'YYYY/MM')} TO ${format(val[1], 'YYYY/MM')}]`
          case 'day':
            return `[${format(val[0], 'YYYY/MM/d')} TO ${format(val[1], 'YYYY/MM/d')}]`
        }
      default:
        return val
    }
  }
  buildOperator = operator => {
    switch (operator) {
      case 'EQUALS':
        return '='
      case 'GT':
        return '>'
      case 'LT':
        return '<'
      case 'GTE':
        return '>='
      case 'LTE':
        return '<='
      case 'COLON':
        return ':'
      default:
        return ":"
    }
  }
  buildAttribute = attribute => {
    switch (attribute) {
      case 'select':
        return ''
      default:
        return `.${this.state.attribute}`
    }
  }
  
  render() {
    
    return (
      <div style={{ margin: 16, padding: 16 }}>
        <div style={{ margin: 16, display: 'flex', alignItems: 'center' }}>
          <span className='text'>Select</span>
          <Select
            className='input'
            onChange={ev => this.handleChange("field", (ev.target as any).value)}
            value={this.state.field}
          >
            {Object.keys(rqlMetadata).map(field => (
              <MenuItem key={field} value={field}>{fieldMap[field]}</MenuItem>
            ))}
          </Select>

          <AttributeInput
            field={this.state.field}
            value={this.state.attribute}
            onChange={ev => this.handleChange('attribute', (ev.target as any).value)}
          />

          <OperatorInput
            field={this.state.field}
            attribute={this.state.attribute}
            value={this.state.operator}
            onChange={ev => this.handleChange('operator', (ev.target as any).value)}
          />
          
          <ValueTypeInput
            field={this.state.field}
            attribute={this.state.attribute}
            operator={this.state.operator}
            value={this.state.valueType}
            onChange={ev => this.handleChange('valueType', (ev.target as any).value)}
          />
          
          <ValueInput
            field={this.state.field}
            attribute={this.state.attribute}
            operator={this.state.operator}
            type={this.state.valueType}
            value={this.state.value}
            onChange={value => this.handleChange('value', value)}
            dateType={this.state.dateType}
            updateDateType={dateType => this.setState({ dateType })}
          />

          
        </div>
        
      </div>
    );
  }
}

interface IState {
  rqlLines: string[]
  editingRawRql: boolean
  editableRqlStrings: string
  rqlBool: 'AND' | 'OR'
}
export default class App extends React.Component<{}, IState> {
  state: IState = {
    rqlLines: [''],
    editingRawRql: false,
    editableRqlStrings: '',
    rqlBool: 'AND'
  }
  updateLine = (line, i) => {
    this.setState(state => {
      const lines = state.rqlLines;
      lines[i] = line;
      return ({ rqlLines: lines })
    })
  }
  addLine = () => {
    this.setState(state => ({ rqlLines: [...state.rqlLines, ''] }))
  }
  removeLine = () => {
    this.setState(state => ({ rqlLines: state.rqlLines.slice(0, -1) }))
  }
  
  render () {
    return (
      <div>
        <div
          style={{
            display: 'flex', alignItems: 'center',
            padding: '0 128px',
            fontSize: 36,
            color: '#eee',
            background: '#36b90a'
          }}
        >
          <span style={{ fontSize: 96 }}>🧙‍♂️</span>
          RQL Wizard 
        </div>
        {this.state.rqlLines.map((_, i) => (
          <Paper key={i} style={{ margin: '16px 128px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <RQLBuilder  updateLine={line => this.updateLine(line, i)} />
            {i + 1 === this.state.rqlLines.length && (
              <IconButton color='primary' onClick={this.addLine}>
                <PlusIcon />
              </IconButton>
            )}
            {this.state.rqlLines.length > 1 && i + 1 === this.state.rqlLines.length && (
              <IconButton color='secondary' onClick={this.removeLine}>
                <RemoveIcon />
              </IconButton>
            )}
          </Paper>
        ))}
        <div style={{ margin: '16px 0', padding: '16px 128px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>Raw RQL</div>
            <div>
              <span className='text'>Logical Operator:</span>
              <Select value={this.state.rqlBool} onChange={ev => this.setState({ rqlBool: (ev.target as any).value })}>
                <MenuItem value='AND'>AND</MenuItem>
                <MenuItem value='OR'>OR</MenuItem>
              </Select>
            </div>
          </div>
          <Paper style={{ padding: 16, border: '1px solid #ddd' }}>
            {this.state.rqlLines.map((line, i) => (
              <div key={`${i}-${line}`}>
                {i > 0 && <div>{this.state.rqlBool}</div>}
                <p>{line}</p>
              </div>
            ))}
          </Paper>
        </div>
      </div>
    );
  }
}
