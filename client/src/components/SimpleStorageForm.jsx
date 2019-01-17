import React, { Component } from 'react';

export default class SimpleStorageForm extends Component {
  constructor(props) {
    console.log(props);
    super(props);
    this.state = { value: props.storageValue };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentWillReceiveProps(props) {
    this.setState({ value: props.storageValue });
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit = async event => {
    event.preventDefault();
    const { accounts, contract } = this.props;
    await contract.methods.set(this.state.value).send({ from: accounts[0] });
    const newStorageValue = await contract.methods.get().call();
    this.props.handleStorageChange(newStorageValue);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <input
            type="text"
            value={this.state.value}
            onChange={this.handleChange}
          />
        </label>
        <input type="submit" value="Submit" value="Set value" />
      </form>
    );
  }
}
