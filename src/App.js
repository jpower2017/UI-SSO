import React, { Component } from "react";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import Toast from "./Toast";
import ThemeDefault from "./theme-default";
import muiThemeable from "material-ui/styles/muiThemeable";

import "./App.css";
import PinPad from "./PinPad/PinPad.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pinTrys: this.props.pinTrys,
      showPin: false,
      firstTry: null,
      secondTry: null,
      alldata: [
        {},
        {
          message: "Save token?",
          buttons: ["yes", "skip"]
        },
        { message: "Enter 4 digit PIN" },
        { message: "Enter 4 digit PIN again" },
        {
          message: "PINS do not match.",
          buttons: ["retry", "skip"],
          alert: true
        },
        { message: "" } //SUCCESS
      ],
      data: {}
    };
    this.onsubmit = this.onsubmit.bind(this);
    this.ontoast = this.ontoast.bind(this);
  }
  componentWillMount() {}
  componentDidMount() {
    console.log("componentDidMount()");
    console.log("data " + this.state.alldata[1]);
    if (this.state.pinTrys === 1) {
      this.setState({ showPin: true });
      this.updateState(2);
    } else {
      this.updateState(1);
    }
  }

  onsubmit(val) {
    console.log("onsubmit val: " + val);
    console.log("pinTrys " + [this.state.pinTrys, this.state.firstTry]);

    if (this.state.pinTrys === 1) {
      this.successSingle(val);
      return;
    }
    this.state.firstTry
      ? this.evalPins(this.state.firstTry, val)
      : this.updateState(3);
    /* SWITCHED THE ABOVE And BELOW STATEMENTS because of key events*/
    !this.state.firstTry
      ? this.setState({ firstTry: val })
      : this.setState({ secondTry: val });
  }
  evalPins(a, b) {
    console.log("evalPins " + [a, b]);
    a == b ? this.success() : this.updateState(4);
  }

  success() {
    console.log("success url " + this.state.firstTry);
    this.props.action("success", this.state.firstTry);
    this.updateState(5);
  }
  successSingle(val) {
    console.log("successSingle val " + val);
    this.props.action("success", val);
    this.updateState(5);
  }
  ontoast(val) {
    switch (val) {
      case "yes":
        this.setState({ showPin: true });
        this.updateState(2);
        this.props.action("store");
        break;
      case "retry":
        this.clear();
        this.updateState(2);
        break;
      case "skip":
        console.log("skip url  ");
        this.props.action("skip");
        break;
      default:
    }
  }
  updateState(n) {
    console.log("updatState f");
    this.setState({ data: this.state.alldata[n] });
  }
  clear() {
    this.setState({
      firstTry: null,
      secondTry: null
    });
  }
  retry() {
    this.updateState(1);
  }
  getStyle() {
    return this.state.showPin ? "another" : "hide";
  }
  forgotPin = () => {
    console.log("App forgotPin");
    this.props.action("forgotPin");
  };
  render() {
    return (
      <MuiThemeProvider>
        <div style={{ margin: "20px" }}>
          <div className="main">
            <div style={{ margin: "0px" }}>
              <Toast
                data={this.state.data}
                message={this.state.data.message}
                onclick={x => this.ontoast(x)}
                color1="#DF5C33"
                onForgotPin={this.forgotPin}
                showForgotPin={this.state.pinTrys === 1}
              />
            </div>
            <div className={this.getStyle()}>
              <PinPad onsubmit={this.onsubmit} />
            </div>
          </div>
          <div className="footerWrapper">
            <div className="footer" />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;
