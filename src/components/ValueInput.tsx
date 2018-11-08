import React from 'react';
import '../App.css';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import { DatePicker } from 'material-ui-pickers';
import MonthPicker from 'react-month-picker-input';
import 'react-month-picker-input/dist/react-month-picker-input.css';
import YearPicker from 'react-year-picker';
import rqlMetadata from '../rql_metadata.json';

interface ITypeValueInput {
  type: string
  field: string
  attribute: string
  operator: string
  value: any
  onChange: (ev) => void
  updateDateType: (date) => void
  dateType: string
}
export default class ValueInput extends React.Component<ITypeValueInput> {
  state = {
    fileSizeValue: 0,
    fileSizeType: 'KB',
    entityRole: 'select',
    entityValue: '',
    entityOperator: '<'
  }
  componentDidUpdate(prevProps) {
    if (this.props.type === 'filesize' && prevProps.value !== `${this.state.fileSizeValue}${this.state.fileSizeType}`) {
      this.props.onChange(`${this.state.fileSizeValue}${this.state.fileSizeType}`)
    }
  }
  handleFileSizeChange = ev => {
    this.setState({ fileSizeValue: (ev.target as any).value})
    this.props.onChange(`${(ev.target as any).value}${this.state.fileSizeType}`)
  }
  handleFileSizeTypeChange = ev => {
    this.setState({ fileSizeType: (ev.target as any).value })
    this.props.onChange(`${this.state.fileSizeValue}${(ev.target as any).value}`)
  }
  handleDateTypeChange = ev => {
    this.props.updateDateType(ev.target.value)
  }

  handleEntityRoleChange = ev => {
    this.setState({ entityRole: ev.target.value })
    this.props.onChange(`(${(ev.target as any).value}${this.state.entityOperator}${this.state.entityValue})`)
  }
  handleEntityValueChange = ev => {
    this.setState({ entityValue: ev.target.value })
    this.props.onChange(`(${this.state.entityRole}${this.state.entityOperator}${(ev.target as any).value})`)
  }
  handleEntityOperatorChange = ev => {
    this.setState({ entityOperator: ev.target.value })
    this.props.onChange(`(${this.state.entityRole}${(ev.target as any).value}${this.state.entityValue})`)
  }

  getLexicons = (field, attribute, operator, operatorType) => {
    const types = rqlMetadata[field].qualifiers[attribute][operator][0]
    return types.filter(type => type.type === operatorType)[0].lexicons
  }
  getRoles = (field, attribute, operator, entityType) => {
    const types = rqlMetadata[field].qualifiers[attribute][operator][0]
    return types.filter(type => type.type === entityType)[0].roles
  }
  render () {
    
    switch (this.props.type) {
      case 'datetime':
        return (
          <>
            <Select
              className='input'
              onChange={this.handleDateTypeChange}
              value={this.props.dateType}
            >
              <MenuItem value='day'>day</MenuItem>
              <MenuItem value='month'>month</MenuItem>
              <MenuItem value='year'>year</MenuItem>
            </Select>
            {this.props.dateType === 'day' ? (
              <DatePicker
                className='input'
                autoOk
                value={this.props.value}
                onChange={date => this.props.onChange(date)}
              />
            ) : this.props.dateType === 'month' ? (
              <MonthPicker
                year={2018}
                month={11}
                onChange={(_, year, month) => this.props.onChange(new Date(year, month))}
                closeOnSelect
              />
            ) : (
              <YearPicker
                onChange={year => this.props.onChange(new Date(year, 0))}
              />
            )}
          </>
        )
      case 'datetime-range':
        return (
          <>
            <Select
              className='input'
              onChange={this.handleDateTypeChange}
              value={this.props.dateType}
            >
              <MenuItem value='day'>days</MenuItem>
              <MenuItem value='month'>months</MenuItem>
              <MenuItem value='year'>years</MenuItem>
            </Select>
            {this.props.dateType === 'day' ? (
              <>
                <DatePicker
                  className='input'
                  autoOk
                  value={this.props.value[0]}
                  onChange={date => this.props.onChange([date, this.props.value[1]])}
                />
                <DatePicker
                  className='input'
                  autoOk
                  value={this.props.value[1]}
                  onChange={date => this.props.onChange([this.props.value[0], date])}
                />
              </>
            ) : this.props.dateType === 'month' ? (
              <>
                <MonthPicker
                  year={2018}
                  month={11}
                  onChange={(_, year, month) => this.props.onChange([new Date(year, month), this.props.value[1]])}
                  closeOnSelect
                />
                <MonthPicker
                  year={2018}
                  month={11}
                  onChange={(_, year, month) => this.props.onChange([this.props.value[0], new Date(year, month)])}
                  closeOnSelect
                />
              </>
            ) : (
              <>
                <YearPicker
                  onChange={year => this.props.onChange([new Date(year, 0), this.props.value[1]])}
                />
                <YearPicker
                  onChange={year => this.props.onChange([this.props.value[0], new Date(year, 0)])}
                />
              </>
            )}
          </>
        )
      case 'lexicon':
        const lexicons = this.getLexicons(this.props.field, this.props.attribute, this.props.operator, this.props.type)

        return (
          <Select
            className='input'
            value={this.props.value}
            onChange={ev => this.props.onChange((ev.target as any).value)}
          >
            {lexicons.map(lexicon => (
              <MenuItem key={lexicon} value={lexicon}>{lexicon}</MenuItem>
            ))}
          </Select>
        )
      case 'bytes':
        
        return (
          <>
            <TextField
              className='input'
              type='number'
              value={this.state.fileSizeValue}
              onChange={this.handleFileSizeChange}
            />
            <Select value={this.state.fileSizeType} onChange={this.handleFileSizeTypeChange}>
              <MenuItem value='KB'>KB</MenuItem>
              <MenuItem value='MB'>MB</MenuItem>
              <MenuItem value='GB'>GB</MenuItem>
              <MenuItem value='TB'>TB</MenuItem>
            </Select>
          </>
        );
      case 'int': 
        return (
          <TextField
            value={this.props.value}
            type='number'
            onChange={ev => this.props.onChange((ev.target as any).value)}
          />
        );
      case 'entity-filter':
      case 'entity-count':
        const roles = this.getRoles(this.props.field, this.props.attribute, this.props.operator, this.props.type)
        return (
          <>
            <Select
              className='input'
              value={this.state.entityRole}
              onChange={this.handleEntityRoleChange}
            >
              <MenuItem key={0} value='select'>Select Role</MenuItem>
              {roles.map(role => (
                <MenuItem key={role} value={role}>{role}</MenuItem>
              ))}
            </Select>
            <Select
              className='input'
              value={this.state.entityOperator}
              onChange={this.handleEntityOperatorChange}
            >
              <MenuItem key='=' value='>'>=</MenuItem>
              <MenuItem key='<' value='<'>&lt;</MenuItem>
              <MenuItem key='>' value='>'>&gt;</MenuItem>
            </Select>
            <TextField
              value={this.state.entityValue}
              onChange={this.handleEntityValueChange}
            />
          </>
        )
      case 'string':
      default:
        return (
          <TextField
            className='input'
            value={this.props.value}
            onChange={ev => this.props.onChange((ev.target as any).value)}
          />
        )
    }
  }
}
