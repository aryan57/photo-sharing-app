import React, { useRef, useState } from "react"
import { Button, Alert, Container, Table, InputGroup, ProgressBar, Form, FormControl } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import Header from './Header'
import firebase from "firebase/app"

export default function UpdateProfile() {

  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const nameRef = useRef()
  const { currentUser, updateName, updatePassword, updateEmail, uploadFile,getDownloadURL,updatePhotoURL } = useAuth()
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const [file, setFile] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  async function updateName_() {

    if (nameRef.current.value == "") {
      setError('Name can\'t be empty')
      return
    }

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await updateName(nameRef.current.value)
      setSuccess('Name updated sucessfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function updateEmail_() {

    if (emailRef.current.value == "") {
      setError('Email can\'t be empty')
      return
    }

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await updateEmail(emailRef.current.value)
      setSuccess('Email updated sucessfully')
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
    setSuccess("")
    setLoading(true)

    try {
      await updatePassword(passwordRef.current.value)
      setSuccess('Password updated sucessfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function uploadProfilePicture_() {

    if (file.size > 5 * 1000000) {
      setError("Sorry, max upload size is 5 MB")
      return;
    }

    setLoading(true)
    setSuccess("")
    setError("")
    setUploadProgress(0);

    const metaData = {
      contentType: 'image/jpeg'
    };

    const firebaseFilepath = 'profilePictures/' + currentUser.uid

    try {
      const uploadTask = uploadFile(firebaseFilepath, file, metaData);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      });

      await uploadTask;
      setSuccess("Upload Successfull!")
      
      const newURL = await getDownloadURL(firebaseFilepath)
      console.log(newURL)
      await updatePhotoURL_(newURL)
      setSuccess("Photo URL updated successfully!")

    } catch (err) {
      setError(err.message)
    } finally {
      setUploadProgress(0);
      setLoading(false)
    }

  }

  async function updatePhotoURL_(newURL) {


    try {
      await updatePhotoURL(newURL)
    } catch (err) {
      setError(err.message)
    } finally {
    }
  }

  return (
    <>
      <Header />

      <Container className="d-flex align-items-center justify-content-center">
        <div className="w-100" style={{ maxWidth: "450px", marginTop: 50 }}>


          <h2 className="text-center mb-4">Update Profile</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
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
          <Table striped bordered hover responsive style={{ marginTop: 10 }}>
            <tbody>
              <tr>
                <td>
                  <ProgressBar animated now={uploadProgress} label={`${uploadProgress}%`} />
                </td>
              </tr>
              <tr>
                <td>
                  <Form>
                    <Form.File
                      accept="image/*"
                      label={file ? file.name : "Choose your new profile picture"}
                      custom
                      onChange={(e) => { setFile(e.target.files[0]) }}
                    />
                  </Form>
                </td>
              </tr>
              <tr>
                <td>
                  <Button disabled={loading} className="w-100" onClick={uploadProfilePicture_}>
                    Upload Picture
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
