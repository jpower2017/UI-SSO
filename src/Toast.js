import React, { Component } from "react";
import RaisedButton from "material-ui/RaisedButton";
import Info from "material-ui/svg-icons/action/info-outline";
import Warning from "material-ui/svg-icons/alert/warning";

class Toast extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }
  onKeyDown = event => {
    console.log("onkeydown " + event.keyCode);
    switch (String.fromCharCode(event.keyCode)) {
      case "Y":
        console.log("YES save token");
        this.props.onclick("yes");
        break;
      case "S":
        console.log("SKIP save token");
        this.props.onclick("skip");
        break;
      default:
        this.keyed(event.keyCode);
        break;
    }
  };
  onclick(b) {
    console.log("toast onclick " + b);
    this.props.onclick(b);
  }
  showMessage() {
    return `${this.props.message}`;
  }
  showIcon() {
    const sty = { color: "white", paddingLeft: "8px", paddingBottom: "2px" };
    return this.props.data.alert ? (
      <Warning style={sty} />
    ) : (
      <Info style={sty} />
    );
  }
  render() {
    //const { color1 } = this.props;
    return (
      <div>
        <div
          style={{
            backgroundColor: "#DF5C33",
            /*width: "600px",*/
            padding: "20px",
            //borderRadius: "10px",
            width: "auto",
            opacity: 0.8,
            borderColor: "#770000",
            fontSize: "125%"
          }}
        >
          <div
            style={{
              paddingBottom: "5px",
              paddingLeft: "10px",
              color: "white"
            }}
            key="message"
          >
            {this.showMessage()}
            {this.props.showForgotPin && (
              <div
                onClick={this.props.onForgotPin}
                style={{
                  cursor: "pointer",
                  marginTop: "8px",
                  fontSize: "80%"
                }}
              >
                <u>FORGOT PIN?</u>
              </div>
            )}
          </div>
          {this.props.data.buttons
            ? this.props.data.buttons.map((b, i) => (
                <RaisedButton
                  key={i}
                  label={b}
                  onClick={() => this.onclick(b)}
                  labelColor="#FFFFFF"
                  buttonStyle={{
                    borderRadius: "4px",
                    backgroundColor: "#f58c32"
                  }}
                  style={{ backgroundColor: "none", margin: "5px" }}
                />
              ))
            : null}
        </div>
      </div>
    );
  }
}

export default Toast;
