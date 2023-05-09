import React from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Rank from "./components/Rank/Rank";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import SignIn from "./components/SignIn/SignIn";
import Register from "./components/Register/Register";
import ParticlesBg from "particles-bg";
import Modal from "./components/Modal/Modal";
import Profile from "./components/Profile/Profile";
import "./App.css";

const initialState = {
  input: "",
  imageUrl: "",
  boxes: [],
  route: "signin",
  isSignedIn: false,
  isProfileOpen: false,
  user: {
    id: "",
    name: "",
    email: "",
    password: "",
    entries: 0,
    joined: "",
    pet: "",
    age: "",
  },
};

class App extends React.Component {
  constructor() {
    super();
    this.state = initialState;
  }

  componentDidMount() {
    const token = window.sessionStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3000/signin", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      })
        .then((resp) => resp.json())
        .then((data) => {
          if (data && data.id) {
            fetch(`http://localhost:3000/profile/${data.id}`, {
              method: "get",
              headers: {
                "Content-Type": "application/json",
                Authorization: token,
              },
            })
              .then((resp) => resp.json())
              .then((user) => {
                if (user && user.email) {
                  this.loadUser(user);
                  this.onRouteChange("home");
                }
              });
          }
        })
        .catch(console.log);
    }
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: data.password,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = (data) => {
    if (data && data.outputs) {
      const image = document.getElementById("inputimage");
      const width = image.width;
      const height = image.height;
      return data.outputs[0].data.regions.map((region) => {
        const clarifaiFace = region.region_info.bounding_box;
        return {
          leftCol: clarifaiFace.left_col * width,
          topRow: clarifaiFace.top_row * height,
          rightCol: width - clarifaiFace.right_col * width,
          bottomRow: height - clarifaiFace.bottom_row * height,
        };
      });
    }
    return;
  };

  displayFaceBox = (boxes) => {
    if (boxes) {
      this.setState({ boxes: boxes });
    }
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onPictureSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch("http://localhost:3000/imageurl", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        Authorization: window.sessionStorage.getItem("token"),
      },
      body: JSON.stringify({
        input: this.state.input,
      }),
    })
      .then((response) => response.json())
      .then((result) => {
        if (result) {
          fetch("http://localhost:3000/image", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: window.sessionStorage.getItem("token"),
            },
            body: JSON.stringify({
              id: this.state.user.id,
            }),
          })
            .then((response) => response.json())
            .then((count) => {
              this.setState(Object.assign(this.state.user, { entries: count }));
            })
            .catch((err) => console.log(err));
        }
        this.displayFaceBox(this.calculateFaceLocation(result));
      })
      .catch((error) => console.log("error", error));
  };

  onRouteChange = (route) => {
    if (route === "signout") {
      return this.setState(initialState);
    } else if (route === "home") {
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  toggleModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      isProfileOpen: !prevState.isProfileOpen,
    }));
  };

  render() {
    return (
      <div className="App">
        <ParticlesBg type="cobweb" bg={true} num="75" />
        <Navigation
          isSignedIn={this.state.isSignedIn}
          onRouteChange={this.onRouteChange}
          toggleModal={this.toggleModal}
        />
        {this.state.isProfileOpen ? (
          <Modal>
            <Profile
              toggleModal={this.toggleModal}
              user={this.state.user}
              loadUser={this.loadUser}
            ></Profile>
          </Modal>
        ) : null}
        {this.state.route === "home" ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onButtonSubmit={this.onPictureSubmit}
            />
            <FaceRecognition
              boxes={this.state.boxes}
              imageUrl={this.state.imageUrl}
            />
          </div>
        ) : this.state.route === "signin" ? (
          <SignIn onRouteChange={this.onRouteChange} loadUser={this.loadUser} />
        ) : (
          <Register
            onRouteChange={this.onRouteChange}
            loadUser={this.loadUser}
          />
        )}
      </div>
    );
  }
}

export default App;
