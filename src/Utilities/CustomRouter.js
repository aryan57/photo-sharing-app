import React from "react"
import Signup from "../Authentication/Signup"
import { AuthProvider } from "../contexts/AuthContext"
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"
import Dashboard from "../Pages/Dashboard"
import Login from "../Authentication/Login"
import PrivateRoute from "./PrivateRoute"
import ForgotPassword from "../Authentication/ForgotPassword"
import UpdateProfile from "../Profile/UpdateProfile"
import Profile from "../Profile/Profile"
import Administration from "../Authentication/Administration"
import Grid from "../Pages/Grid"

function CustomRouter() {
  return (
        <Router>
          <AuthProvider>
            <Switch>

              <PrivateRoute exact path="/" component={Dashboard} />
              <PrivateRoute path="/update-profile" component={UpdateProfile} />
              <PrivateRoute path="/profile" component={Profile} />
              <PrivateRoute path="/grid" component={Grid} />
              <PrivateRoute path="/Administration" component={Administration} />

              <Route path="/signup" component={Signup} />
              <Route path="/login" component={Login} />
              <Route path="/forgot-password" component={ForgotPassword} />
              
            </Switch>
          </AuthProvider>
        </Router>
  )
}

export default CustomRouter
