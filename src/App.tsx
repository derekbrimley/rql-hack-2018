import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { DatePicker } from 'material-ui-pickers';
import format from 'date-fns/format';
import MonthPicker from 'react-month-picker-input';
import 'react-month-picker-input/dist/react-month-picker-input.css';
import YearPicker from 'react-year-picker';

interface ITypeValueInput {
  type: "string" | "lexicon" | "date"
  field: 'content' | 'subject' | 'date'
  operator: string
  value: any
  onChange: (ev) => void
}
const ValueInput: React.SFC<ITypeValueInput> = props => {
  switch (props.type) {
    case 'date':
      switch (props.operator) {
        case 'dates':
          return (
            <>
              <DatePicker
                autoOk
                name='value'
                value={props.value[0]}
                onChange={date => props.onChange([date, props.value[1]])}
              />
              <DatePicker
                autoOk
                name='value'
                value={props.value[1]}
                onChange={date => props.onChange([props.value[0], date])}
              />
            </>
          )
        case 'months':
          return (
            <>
              <MonthPicker
                year={2018}
                month={11}
                onChange={(val, year, month) => {
                  console.log(val, year, month, new Date(year, month))
                  props.onChange([new Date(year, month), props.value[1]])
                }}
                closeOnSelect
              />
              <MonthPicker
                year={2018}
                month={11}
                onChange={(val, year, month) => {
                  console.log(val, year, month, new Date(year, month))
                  props.onChange([props.value[0], new Date(year, month)])
                }}
                closeOnSelect
              />
            </>
          )
        case 'years':
          return (
            <>
              <YearPicker
                onChange={(year) => {
                  console.log(year, new Date(year, 0))
                  props.onChange([new Date(year, 0), props.value[0]])
                }}
              />
              <YearPicker
                onChange={(year) => {
                  console.log(year)
                  props.onChange([props.value[1], new Date(year, 0)])
                }}
              />
            </>
          )
        case 'month':
            return (
              <MonthPicker
                year={2018}
                month={11}
                onChange={(val, year, month) => {
                  console.log(val, year, month)
                  props.onChange(new Date(year, month))
                }}
                closeOnSelect
              />
            )
        case 'year':
          return (
            <YearPicker
              onChange={(year) => {
                console.log(year)
                props.onChange(new Date(year, 0))
              }}
            />
          )
        case 'date':
        default:
          return (
            <DatePicker
              autoOk
              name='value'
              value={props.value}
              onChange={date => props.onChange(date)}
            />
          )
      }
    case 'string':
    case 'lexicon':
    default:
      return (
        <TextField
          name='value'
          value={props.value}
          onChange={ev => props.onChange((ev.target as any).value)}
        />
      )
  }
}

interface IAttributeInput {
  field: string
  value: string
  onChange: (ev) => void
}
const AttributeInput: React.SFC<IAttributeInput> = props => {
  switch(props.field) {
    case 'content':
    case 'subject':
      return (
        <>
          <span className='text'>.</span>
          <Select
            name='attribute'
            onChange={props.onChange}
            value={props.value}
          >
            <MenuItem value='select'>Select</MenuItem>
            <MenuItem value="id">ID</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </Select>
        </>
      );
    case 'date':
      return (
        <>
          <Select
            name='attribute'
            onChange={props.onChange}
            value={props.value}
          >
            <MenuItem value="on">On</MenuItem>
            <MenuItem value="before">Before</MenuItem>
            <MenuItem value="after">After</MenuItem>
            <MenuItem value="between">Between</MenuItem>
          </Select>
        </>
      );
  }
}

interface IOperatorInput {
  field: string
  attribute: string
  value: string
  onChange: (ev) => void
}
const OperatorInput: React.SFC<IOperatorInput> = props => {
  switch (props.field) {
    case 'date':
      switch (props.attribute) {
        case 'between':
          return (
            <Select
              name='operator'
              onChange={props.onChange}
              value={props.value}
            >
              <MenuItem value='dates'>Dates</MenuItem>
              <MenuItem value='months'>Months</MenuItem>
              <MenuItem value='years'>Years</MenuItem>
            </Select>
          )
        case 'on':
        case 'before':
        case 'after':
          return (
            <>
              <Select
                name='operator'
                onChange={props.onChange}
                value={props.value}
              >
                <MenuItem value='date'>Date</MenuItem>
                <MenuItem value='month'>Month</MenuItem>
                <MenuItem value='year'>Year</MenuItem>
              </Select>
            </>
          )
        default:
      }
      
    case 'content':
    case 'subject':
    default:
      return (
        <>
          <span className='text'>that</span>
          <Select
            name='operator'
            onChange={props.onChange}
            value={props.value}
          >
            <MenuItem value=":">partially matches</MenuItem>
            <MenuItem value="=">matches exactly</MenuItem>
          </Select>
        </>
      )
  }
}

interface IValueTypeInput {
  field: string
  value: string
  onChange: (ev) => void
}
const ValueTypeInput: React.SFC<IValueTypeInput> = props => {
  switch(props.field) {
    case 'date':
      return null
    case 'content':
    case 'subject':
    default:
      return (
        <>
          <span className='text'>the</span>
          <Select
            name='valueType'
            onChange={props.onChange}
            value={props.value}
          >
            <MenuItem value='string'>text</MenuItem>
            <MenuItem value='lexicon'>lexicon</MenuItem>
            <MenuItem value='date'>date</MenuItem>
          </Select>
        </>
      )
  }
}

interface IState {
  field: "date" | "content" | "subject"
  attribute: string
  operator: string
  valueType: "string" | "lexicon" | "date"
  value: string | Date | [Date, Date]
}
class App extends Component<{}, IState> {
  state: IState = {
    field: 'content',
    attribute: 'select',
    operator: ':',
    valueType: 'string',
    value: '',
  }
  handleChange = (name, value): void => {
    if (name === 'field' && value === 'date') {
      this.setState({ attribute: 'on', operator: 'date', valueType: 'date', value: new Date() })
    }
    if ((name === 'field') && (value === 'content' || value === 'subject')) {
      this.setState({ attribute: 'select', operator: ':' })
    }
    if (name === 'attribute' && value === 'between') {
      this.setState({ operator: 'dates', value: [new Date(), new Date()] })
    }
    if (name === 'valueType') {
      if (value === 'date') {
        this.setState({ value: new Date() })
      } else {
        this.setState({ value: '' })
      }
    }
    this.setState({ [name]: value } as Pick<IState, keyof IState>)
  }
  buildValue = (val, type, operator) => {
    switch (type) {
      case 'string':
        return `"${val}"`
      case 'lexicon':
        return `{${val}}`
      case 'date':
        switch (operator) {
          case 'years':
            return `[${format(val[0], 'YYYY')} TO ${format(val[1], 'YYYY')}]`
          case 'months':
            return `[${format(val[0], 'YYYY/MM')} TO ${format(val[1], 'YYYY/MM')}]`
          case 'dates':
            return `[${format(val[0], 'YYYY/MM/d')} TO ${format(val[1], 'YYYY/MM/d')}]`
          case 'year':
            return format(val, 'YYYY')
          case 'month':
            return format(val, 'YYYY/MM')
          case 'date':
          default:
            return format(val, 'YYYY/MM/d')
        }
      default:
        return val
    }
  }
  buildOperator = (operator) => {
    switch (operator) {
      case '=':
        return '='
      case ':':
      case 'date':
      case 'month':
      case 'year':
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
            name='field'
            onChange={ev => this.handleChange((ev.target as any).name, (ev.target as any).value)}
            value={this.state.field}
          >
            <MenuItem value="content">Content</MenuItem>
            <MenuItem value="subject">Subject</MenuItem>
            <MenuItem value="date">Date</MenuItem>
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
            value={this.state.valueType}
            onChange={ev => this.handleChange('valueType', (ev.target as any).value)}
          />
          
          <ValueInput
            field={this.state.field}
            operator={this.state.operator}
            type={this.state.valueType}
            value={this.state.value}
            onChange={value => this.handleChange('value', value)}
          />
        </div>
        <div style={{ margin: 16 }}>
          <div>Raw RQL</div>
          <div style={{ padding: 16, border: '1px solid #ddd' }}>

            {`${this.state.field}${this.buildAttribute(this.state.attribute)}${this.buildOperator(this.state.operator)}${this.buildValue(this.state.value, this.state.valueType, this.state.operator)}`}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
