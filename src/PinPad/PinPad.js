import React, { Component } from "react";
import "./pinpad.css";
import * as R from "ramda";

class PinPad extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      limit: 4
    };
    this.addNumber = this.addNumber.bind(this);
    this.clearForm = this.clearForm.bind(this);
    this.back = this.back.bind(this);
  }
  componentWillMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }
  onKeyDown = event => {
    console.log("onkeydown " + event.keyCode);
    switch (event.keyCode) {
      case 27:
        alert("Escape key pressed");
        break;
      default:
        this.keyed(event.keyCode);
        break;
    }
  };
  /*convert numpad keycode to number keycode */
  convertNumPad = n => {
    let numPadData = [
      { name: "numpad0", k: 96, val: 48 },
      { name: "numpad1", k: 97, val: 49 },
      { name: "numpad2", k: 98, val: 50 },
      { name: "numpad3", k: 99, val: 51 },
      { name: "numpad4", k: 100, val: 52 },
      { name: "numpad5", k: 101, val: 53 },
      { name: "numpad6", k: 102, val: 54 },
      { name: "numpad7", k: 103, val: 55 },
      { name: "numpad8", k: 104, val: 56 },
      { name: "numpad9", k: 105, val: 57 }
    ];
    let convertedVal = R.prop("val", R.find(x => x.k == n, numPadData));
    return convertedVal ? convertedVal : n;
  };
  keyed = n => {
    console.log("keyed " + n);
    console.log("converted convertNumPad " + this.convertNumPad(n));
    let num = this.convertNumPad(n);
    console.log("is number? : " + Number(String.fromCharCode(num)));
    console.log(Number(String.fromCharCode(num)) ? "yes" : "no");
    Number(String.fromCharCode(num)) &&
      this.addKeyNumber(String.fromCharCode(num));
  };

  addKeyNumber = n => {
    console.log("addKeyNumber f  only numbers... " + n);
    console.log("this.state.value " + this.state.value);
    this.setState({
      value: this.state.value ? this.state.value.concat(n) : n
    });
    if (this.state.limit === this.state.value.length) {
      const s = String(this.state.value);
      this.submitForm(s);
    }
  };

  addNumber(event) {
    console.log("addnumber f " + event.target.value);
    this.setState({
      value: this.state.value
        ? this.state.value.concat(event.target.value)
        : event.target.value
    });
    if (this.state.limit === this.state.value.length + 1) {
      const s = String(this.state.value.concat(event.target.value));
      this.submitForm(s);
    }
  }
  clearForm(e) {
    console.log("clearform f");
    this.setState({ value: "" });
  }
  back(e) {
    console.log("back f");
    console.log("state.value " + this.state.value);
    let tempValue = this.state.value;
    let newValue = tempValue.substr(0, tempValue.length - 1);
    console.log("newValue " + newValue);
    this.setState({
      value: newValue
    });
  }
  enter() {}
  submitForm(v) {
    console.log("submitform v: " + v);
    this.props.onsubmit(v);
    this.clearForm();
  }
  createKeyPad() {
    return <div>{this.createRowKeyPad([1, 2, 3, 4, 5, 6, 7, 8, 9])}</div>;
  }
  createRowKeyPad(args) {
    return (
      <div>
        {args.map(x => this.createInput(x))}
        <br />
      </div>
    );
  }
  createInput(n) {
    return (
      <input
        key={n}
        type="button"
        className="PINbutton"
        name={n}
        value={n}
        id={n}
        onClick={this.addNumber}
      />
    );
  }
  render() {
    return (
      <div name="PINform" id="PINform">
        <input
          id="PINbox"
          type="password"
          value={this.state.value}
          name="PINbox"
          disabled
        />
        {this.createKeyPad()}
        <input
          type="button"
          className="PINbutton clear"
          name="-"
          value="clear"
          id="-"
          onClick={this.clearForm}
        />
        {this.createInput(0)}
        <input
          type="button"
          className="PINbutton back"
          name="-"
          value="back"
          id="-"
          onClick={this.back}
        />
      </div>
    );
  }
}

export default PinPad;
