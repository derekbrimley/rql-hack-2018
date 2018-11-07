import React, { Component } from 'react';
import './App.css';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

class App extends Component {
  state = {
    field: 'content',
    attribute: 'id',
    operator: ':',
    valueType: 'string',
    value: '',
  }
  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value })
  }
  buildValue = (text, type) => {
    switch (type) {
      case 'string':
        return `"${text}"`
      case 'lexicon':
        return `{${text}}`
    }
  }
  render() {
    return (
      <div style={{ margin: 16, padding: 16 }}>
        <div style={{ margin: 16 }}>
          <span className='text'>Select</span>
          <Select
            name='field'
            onChange={this.handleChange}
            value={this.state.field}
          >
            <MenuItem value="content">Content</MenuItem>
            <MenuItem value="sender">Sender</MenuItem>
          </Select>
          <span className='text'>.</span>
          <Select
            name='attribute'
            onChange={this.handleChange}
            value={this.state.attribute}
          >
            <MenuItem value="id">ID</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </Select>
          <span className='text'>that</span>
          <Select
            name='operator'
            onChange={this.handleChange}
            value={this.state.operator}
          >
            <MenuItem value=":">partially matches</MenuItem>
            <MenuItem value="=">matches exactly</MenuItem>
          </Select>
          <span className='text'>the</span>
          <Select
            name='valueType'
            onChange={this.handleChange}
            value={this.state.valueType}
          >
            <MenuItem value='string'>text</MenuItem>
            <MenuItem value='lexicon'>lexicon</MenuItem>
          </Select>
          <TextField
            name='value'
            value={this.state.value}
            onChange={this.handleChange}
            />
        </div>
        <div style={{ margin: 16 }}>
          <div>Raw RQL</div>
          <div style={{ padding: 16, border: '1px solid #ddd' }}>

            {`${this.state.field}.${this.state.attribute}${this.state.operator}${this.buildValue(this.state.value, this.state.valueType)}`}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
