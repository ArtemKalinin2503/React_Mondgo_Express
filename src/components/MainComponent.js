import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';


export default class MainComponent extends Component {

    render() {
      return (
        <div className="MainComponent">
          <header className="App-header">
              <h1>Компонет MainComponent</h1>
          </header>
        </div>
      );
    }
}

  