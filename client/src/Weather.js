import React, { Component } from 'react'

export default class Weather extends Component {
  constructor() {
    super();
    this.state = {
      weather: 'N/A'
    };
  }

  handleClick = () => {
    fetch('http://localhost:5000/dublin')
    .then(res => res.json())
    .then(res => this.setState({weather: res.temp}));  
  };

  render() {
    return (
      <div>
        <button onClick={this.handleClick}>Get weather in dublin</button>
        <h1>The weather in dublin is: {this.state.weather}</h1>
      </div>
    )
  }
}
