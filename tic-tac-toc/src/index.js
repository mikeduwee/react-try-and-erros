import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
  return (
    <button 
      className={props.marked? 'squareMarked': 'square'}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}


class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        marked={this.props.marked===i?'Marked':''}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderBoards() {
    const board_index = [
      [0,1,2],
      [3,4,5],
      [6,7,8]
    ]
    let board = board_index.map(row=>
      <div className="board-row">{
        row.map(ceil=>this.renderSquare(ceil))
      }</div>
    )
    return (
      <div>{board}</div>
    )
  }

  render() {
    return (
      <div>
        {this.renderBoards()}
      </div>
    );
  }
}

class Toggle extends React.Component {

  render() {
    return (
      <button onClick={this.props.handleToggleClick}>
        {this.props.isToggleAsc ? 'ASC' : 'DESC'}
      </button>
    );
  }
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        marked: [null, null]
      }],
      stepNumber: 0,
      xIsNext: true,
      isToggleAsc: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const marked = i
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        marked: marked,
        playedBy: squares[i]
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  handleToggleClick() {
    this.setState(prevState => ({
     isToggleAsc: !prevState.isToggleAsc
    }));
  }

  jumpTo(step){
    this.setState({
      stepNumber: step,
      xIsNext: (step %2 ) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const isAsc = this.state.isToggleAsc;

    const moves = history.map((step, move) => {
      const marked = index2rowcolumn(step.marked)
      const desc = move ? 
        'Go to move #' + move + ': ('+ marked + ') ' + step.playedBy:
        'Go to game start';
      return (
        <li key={move}>
          <botton onClick={() => this.jumpTo(move)}>
            {desc}
          </botton>
        </li>
      )
    });

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            marked={current.marked}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <Toggle
              handleToggleClick={() => this.handleToggleClick()}
              isToggleAsc={isAsc}
          />
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

function index2rowcolumn(i) {
  let column = i%3
  let row = Math.floor(i/3)
  return [column, row]
}