import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {
  state = {
    manager: "",
    players: [],
    balance: "",
    value: "",
    message: ""
  };
  async componentDidMount() {
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({ manager, players, balance });
  }

  onSubmit = async (event) => {
    event.preventDefault()
    const accounts = await web3.eth.getAccounts()

    this.setState({message: "Waiting on transaction success.. "})

    await lottery.methods.enter().send({from: accounts[0], value: web3.utils.toWei(this.state.value, "ether" )})

    this.setState({message: "You have been entered in the lottery."})
  }

  onClick = async () => {
    const accounts = await web3.eth.getAccounts()
    this.setState({message: "Waiting on transaction success.."})
    // send transaction does not return information
    await lottery.methods.pickWinner().send({
      from: accounts[0],
    })
    this.setState({message: "A winner has been chosen! Check your wallet for winnings :) "})
    await lottery.methods.Winner
  }

  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>
          This contract is managed by {this.state.manager}. There are currently {" "} 
          {this.state.players.length} people entered, competing to win: {" "}
          {web3.utils.fromWei(this.state.balance, "ether")} ether!
        </p>
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Amount to enter: </label>
            <input value = {this.state.value} onChange={event => this.setState({value: event.target.value})}></input>
          </div>
          <button>Enter</button>    
        </form>
        <hr/>
        <h4>Ready to pick a winner?</h4>
        <button onClick={this.onClick}>Pick a Winner!</button>

        <hr/>
        <h4 color="red">{this.state.message}</h4>
      </div>
    );
  }
}
export default App;