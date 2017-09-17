/* eslint import/no-webpack-loader-syntax: off */

import './App.css';
import ChessBoard from './ChessBoard.js';
import React, { Component } from 'react';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Header from './Header.js';
import Footer from './Footer.js';
import { WindowResizeListener } from 'react-window-resize-listener'
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Slider from 'material-ui/Slider';
var Chess = require('./chess.js').Chess;


const chessLight = getMuiTheme({
  palette: {
    primary1Color: 'white',
    textColor: '#333',
  },
  appBar: {
    textColor: '#333',
  },
  slider: {
    trackColor: '#aaa',
    selectionColor: '#333'
  },  
});

function resized(w, h) {
  if (w < 768) {
    var elements = document.getElementsByClassName('seperator');
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.style.marginTop = ((-31.0 / 200.0) * w + (1443.0 / 200.0)) + "px";
    }
    elements = document.getElementsByClassName('chess-board');
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      element.style.fontSize = ((1.0 / 8.0) * w - (5.0 / 8.0)) + "px";
    }
  }
}

class App extends Component {

  constructor(props) {
    super(props);
    var chess = new Chess();
    this.state = {
      board:chess.fen(),
      newGameDiaOpen: false,
      intelligenceDiaOpen: false,
      intelligenceLevel:localStorage.getItem("intelligenceLevel")?localStorage.getItem("intelligenceLevel"):"10"
    };

  }
  requestCloseNewGame = () => {
    this.setState({ newGameDiaOpen: false });
  };
  requestOpenNewGame = () => {
    this.setState({ newGameDiaOpen: true })
  }

  requestCloseIntelligenceDia = () => {
    this.setState({ intelligenceDiaOpen: false });
  };
  requestOpenIntelligenceDia = () => {
    this.setState({ intelligenceDiaOpen: true })
  }
  onChangeIntelligenceLevel = (event,value) => {
    localStorage.setItem("intelligenceLevel",`${value}`)
    this.setState({intelligenceLevel:`${value}`});
  }
  requestCreateNewGame = () => {
    var chess = new Chess();
    this.setState({ newGameDiaOpen: true,board:"rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1" })
  } 

  render() {
    const newGameActions = [
      <FlatButton label="Cancel" primary={true} style={{ color: '#333' }} onClick={this.requestCloseNewGame} />,
      <FlatButton label="OK" primary={true} style={{ color: '#333' }} onClick={this.requestCreateNewGame} />,
    ];

    const intelligenceActions = [
      <FlatButton label="Cancel" primary={true} style={{ color: '#333' }} onClick={this.requestCloseIntelligenceDia} />,
      <FlatButton label="OK" primary={true} style={{ color: '#333' }} onClick={this.requestCloseIntelligenceDia} />,
    ];

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(chessLight)}>
        <div className="App">
          <Header requestOpenNewGame={this.requestOpenNewGame} requestOpenIntelligenceDia={this.requestOpenIntelligenceDia}/>
          <WindowResizeListener onResize={windowSize => { resized(windowSize.windowWidth, windowSize.windowHeight) }} />
          <ChessBoard intelligenceLevel={this.state.intelligenceLevel} board={this.state.board}/>

          <Dialog title="New Game" actions={newGameActions} modal={false} open={this.state.newGameDiaOpen} onRequestClose={this.handleClose} >
            Start a new game?
          </Dialog>
          <Dialog title="AI Strength" actions={intelligenceActions} modal={false} open={this.state.intelligenceDiaOpen} onRequestClose={this.requestCloseIntelligenceDia} >
            <div className="label">Depth {this.state.intelligenceLevel}</div>
            <Slider step={1} value={this.state.intelligenceLevel} min={1} max={20} defaultValue={this.state.intelligenceLevel} onChange={this.onChangeIntelligenceLevel} /> 
          </Dialog>

          
          <Footer/>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
