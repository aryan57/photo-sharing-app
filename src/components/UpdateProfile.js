import React, { useRef, useState } from "react"
import { Button, Alert, Container, Table, InputGroup, FormControl } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import Header from './Header'

export default function UpdateProfile() {

  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const nameRef = useRef()
  const { currentUser, updateName, updatePassword, updateEmail } = useAuth()
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function updateName_() {

    if (nameRef.current.value == "") {
      setError('Name can\'t be empty')
      return
    }

    setError("")
    setMessage("")
    setLoading(true)

    try {
      await updateName(nameRef.current.value)
      setMessage('Name updated sucessfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateEmail_() {

    if (nameRef.current.value == "") {
      setError('Name can\'t be empty')
      return
    }

    setError("")
    setMessage("")
    setLoading(true)

    try {
      await updateEmail(emailRef.current.value)
      setMessage('Email updated sucessfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }
  async function updatePassword_() {

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      setError("Passwords do not match")
      return
    }
    if (passwordRef.current.value.length < 6) {
      setError("Password too short. Please give atleast 6 characters.")
      return
    }

    setError("")
    setMessage("")
    setLoading(true)

    try {
      await updatePassword(passwordRef.current.value)
      setMessage('Password updated sucessfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Header />

      <Container className="d-flex align-items-center justify-content-center">
        <div className="w-100" style={{ maxWidth: "500px", marginTop: 50 }}>


          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Table striped bordered hover responsive style={{ marginTop: 10 }}>
            <tbody>
              <tr>
                <td >{currentUser.email}</td>
              </tr>
              <tr>
                <td>
                  <InputGroup >
                    <FormControl ref={emailRef} placeholder="New Email" />
                  </InputGroup>
                </td>
              </tr>
              <tr>
                <td>
                  <Button onClick={updateEmail_} disabled={loading} className="w-100">
                    Update Email
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>


          <Table striped bordered hover responsive style={{ marginTop: 10 }}>
            <tbody>
              <tr>
                <td>{currentUser.displayName}</td>
              </tr>
              <tr>
                <td>
                  <InputGroup>
                    <FormControl ref={nameRef} placeholder="New Name" />
                  </InputGroup>
                </td>
              </tr>
              <tr>
                <td>
                  <Button onClick={updateName_} disabled={loading} className="w-100">
                    Update Name
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>

          <Table striped bordered hover responsive style={{ marginTop: 10 }}>
            <tbody>
              <tr>
                <td>
                  <InputGroup>
                    <FormControl ref={passwordRef} placeholder="New Password" />
                  </InputGroup>
                </td>
              </tr>
              <tr>
                <td>
                  <InputGroup>
                    <FormControl ref={passwordConfirmRef} placeholder="Confirm New Password" />
                  </InputGroup>
                </td>
              </tr>
              <tr>
                <td>
                  <Button onClick={updatePassword_} disabled={loading} className="w-100">
                    Update Password
                  </Button>
                </td>
              </tr>

            </tbody>
          </Table>

        </div>
      </Container>
    </>
  )
}
