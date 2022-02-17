import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    const className = props.winnerSquare ? 'square winner' : 'square'
    return (
        <button className={className} onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        let winnerSquare = false
        this.props.winnerLine.forEach(square => {
            if (square === i) {
                winnerSquare = true
            }
        });

        return (
            <Square
                value={this.props.squares[i]}
                winnerSquare={winnerSquare}
                onClick={() => this.props.onClick(i)}
            />
        )
    }

    render() {
        let rows = []

        for (let row = 0; row < 3; row++) {
            let cells = []

            for (let column = 0; column < 3; column++) {
                cells.push(this.renderSquare(row * 3 + column))
            }

            rows.push(<div className="board-row">{cells}</div>)
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null)
            }],
            stepNumber: 0,
            xIsNext: true,
            ascending: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1)
        const current = history[history.length - 1]
        const squares = current.squares.slice()
        if (calculateWinner(squares)[0] || squares[i]) {
            return
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O'
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    handleClick2() {
        this.setState({
            ascending: !this.state.ascending,
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        })
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const [winner, winnerLine] = calculateWinner(current.squares)
        const tie = calculateTie(current.squares)
        const ascending = this.state.ascending

        if (!ascending) {
            history.reverse()
        }

        const moves = history.map((step, move) => {
            move = ascending ? move : history.length - move - 1

            const desc = move ?
                `Go to move #${move}` :
                'Go to game start'
            let movelocation = ''

            if (!ascending) {
                history.reverse()
            }

            if (move > 0) {
                for (let i = 0; i < step.squares.length; i++) {
                    const square = step.squares[i];
                    if (square !== history[move-1].squares[i]) {
                        movelocation = ` (${i % 3 + 1}, ${Math.floor(i / 3) + 1})`
                    }
                }
            }

            if (!ascending) {
                history.reverse()
            }

            return (
                <li key={move}>
                    <button className={(move === this.state.stepNumber) ? 'current' : ''} onClick={() => this.jumpTo(move)}>
                        {desc + movelocation}
                    </button>
                </li>
            )
        })

        if (!ascending) {
            history.reverse()
        }

        let status
        if (winner) {
            status = `Winner: ${winner}`
        } else if (tie) {
            status = `Tie`
        } else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`
        }

        return (
        <div className="game">
            <div className="game-board">
                <Board 
                    squares={current.squares}
                    winnerLine={winnerLine}
                    onClick={(i) => this.handleClick(i)}
                />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <button onClick={() => this.handleClick2()}>sort move list ({ascending ? 'ascending' : 'descending'})</button>
                <ol>{moves}</ol>
            </div>
        </div>
        );
    }
}

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
            return [squares[a], lines[i]];
        }
    }
    return [null, Array(3).fill(null)];
}

function calculateTie(squares) {
    for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
            return null
        }
    }
    return true;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);