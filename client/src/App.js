import React, { Component } from 'react';
import SimpleStorageForm from './components/SimpleStorageForm';
import SimpleStorageContract from './contracts/SimpleStorage.json';
import getWeb3 from './utils/getWeb3';

import './App.css';

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorageContract.networks[networkId];
      const instance = new web3.eth.Contract(
        SimpleStorageContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      const storageValue = await instance.methods.get().call();

      // Set web3, accounts, and contract to the state
      this.setState({ web3, accounts, contract: instance, storageValue });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  handleClick = async () => {
    const { accounts, contract } = this.state;
    const newAmount = Math.floor(Math.random() * 10);

    await contract.methods.set(newAmount).send({ from: accounts[0] });
    const response = await contract.methods.get().call();
    this.setState({ storageValue: response });
  };

  handleStorageChange(newStorageValue) {
    this.setState({ storageValue: newStorageValue });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <h1>Simple Storage Smart Contract</h1>

        <div className="container">
          <div>The stored value is: {this.state.storageValue}</div>

          <button onClick={this.handleClick.bind(this)}>
            Set value to random digit
          </button>

          <SimpleStorageForm
            {...this.state}
            handleStorageChange={this.handleStorageChange.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default App;
