import React from "react";
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";

class ProfileIcon extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownOpen: false,
    };
  }

  toggle = () => {
    this.setState((prevstate) => ({ dropdownOpen: !prevstate.dropdownOpen }));
  };

  render() {
    return (
      <div className="pa4 tc">
        <Dropdown isOpen={this.state.dropdownOpen} toggle={() => {}}>
          <DropdownToggle
            data-toggle="dropdown"
            tag="span"
            onClick={this.toggle}
          >
            <img
              src="https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg"
              className="br-100 ba h3 w3 dib"
              alt="avatar"
            />
          </DropdownToggle>
          <DropdownMenu
            className="b--transparent shadow-5"
            modifiers={[
              { name: "offset", options: { offset: [0, 20] } },
              { name: "preventOverflow", options: { padding: 10 } },
              { name: "flip", enabled: true },
            ]}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.5",
            }}
          >
            <DropdownItem
              onClick={() => {
                this.props.toggleModal();
                this.toggle();
              }}
            >
              View Profile
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                this.props.onRouteChange("signout");
                this.toggle();
              }}
            >
              Sign Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}

export default ProfileIcon;
