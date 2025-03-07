import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import React from "react";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import FullPost from "./components/FullPost";
import CustomLayout from "./containers/Layout";

import "antd/dist/antd.less"; // or 'antd/dist/antd.less'
import "./App.css";

import { Provider } from "react-redux";
import { ReactReduxFirebaseProvider } from "react-redux-firebase";

import { store, rrfProps } from "./createStore";
import UserPage from "./components/UserPage";

const App = (props) => {
  return (
    <Provider store={store}>
      <ReactReduxFirebaseProvider {...rrfProps}>
        <Router>
          <Switch>
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />

            <CustomLayout {...props}>
              <Route exact path="/" component={Home} />
              <Route exact path="/p/:postId" component={FullPost} />
              <Route exact path="/u/:userId" component={UserPage} />
            </CustomLayout>
          </Switch>
        </Router>
      </ReactReduxFirebaseProvider>
    </Provider>
  );
};

export default App;
