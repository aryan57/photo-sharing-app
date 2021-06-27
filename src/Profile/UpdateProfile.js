import React, { useRef, useState, useEffect } from "react"
import { Button, Alert, Container, Table, InputGroup, ProgressBar, Form, FormControl } from "react-bootstrap"
import Header from '../Widgets/Header'
import resizeImage from "../Utilities/ResizeImage";

import { useAuth } from "../contexts/AuthContext"
import firebase from "firebase/app"

export default function UpdateProfile() {

  const emailRef = useRef()
  const bioRef = useRef()
  const websiteRef = useRef()
  const passwordRef = useRef()
  const passwordConfirmRef = useRef()
  const nameRef = useRef()

  const { currentUser,
    updateName,
    updatePassword,
    updateEmail,
    uploadFile,
    getDownloadURL,
    updatePhotoURL,
    updateBio,
    updateWebsite,
    getUserDocReference
  } = useAuth()

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [bio, setBio] = useState("")
  const [website, setWebsite] = useState("")
  const [loading, setLoading] = useState(false)

  const [file, setFile] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  async function updateName_() {

    if (nameRef.current.value === "") {
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
  async function updateBio_() {

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await updateBio(bioRef.current.value)
      await setBio_()
      setSuccess('Bio updated sucessfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }

  }
  async function setBio_() {
    try {
      const docRef = await getUserDocReference(currentUser.uid)
      setBio(docRef.data().bio)
    } catch (err) {
      console.log(err.message)
    } finally {

    }
  }
  async function updateWebsite_() {

    let newWebsite = websiteRef.current.value;
    if (newWebsite !== "" && !newWebsite.startsWith('http://') && !newWebsite.startsWith('https://')) {
      newWebsite = "https://" + newWebsite;
    }

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      await updateWebsite(newWebsite)
      await setWebsite_()
      setSuccess('Website updated sucessfully')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }

  }

  async function setWebsite_() {
    try {
      const docRef = await getUserDocReference(currentUser.uid)
      setWebsite(docRef.data().website)
    } catch (err) {
      console.log(err.message)
    } finally {

    }
  }

  async function updateEmail_() {

    if (emailRef.current.value === "") {
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

    if (!file || file.type.lastIndexOf('/') < 0) {
      setError("Please select a valid image")
      return
    }

    if (file.size > 40 * 1000000) {
      setError("Sorry, compression for files more than 40 MB in size is not allowed.")
      return;
    }

    setLoading(true)
    setSuccess("")
    setError("")
    setUploadProgress(0);


    try {
      const compressedFile = await resizeImage(file);
      const contentType = compressedFile.type;
      const metaData = {
        contentType: contentType,
        customMetadata: {
          'originalFileName': file.name,
        }
      };

      const fileExtension = contentType.substring(contentType.lastIndexOf('/') + 1)
      const firebaseFilepath = 'profilePictures/' + currentUser.uid + '.' + fileExtension
      const uploadTask = uploadFile(firebaseFilepath, compressedFile, metaData);

      uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      });

      await uploadTask;
      setSuccess("Upload Successfull!")

      const newURL = await getDownloadURL(firebaseFilepath)
      await updatePhotoURL_(newURL)
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
      setSuccess("Photo URL updated successfully!")
    } catch (err) {
      setError(err.message)
    } finally {
    }
  }

  useEffect(() => {
    let ignore = false;

    if (!ignore) {
      setBio_();
      setWebsite_();
    }
    return () => { ignore = true; }
  }, []);

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
                <td >{bio}</td>
              </tr>
              <tr>
                <td>
                  <InputGroup >
                    <FormControl ref={bioRef} placeholder="New Bio" />
                  </InputGroup>
                </td>
              </tr>
              <tr>
                <td>
                  <Button onClick={updateBio_} disabled={loading} className="w-100">
                    Update Bio
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>
          <Table striped bordered hover responsive style={{ marginTop: 10 }}>
            <tbody>
              <tr>
                <td >{website}</td>
              </tr>
              <tr>
                <td>
                  <InputGroup >
                    <FormControl ref={websiteRef} placeholder="New Website" />
                  </InputGroup>
                </td>
              </tr>
              <tr>
                <td>
                  <Button onClick={updateWebsite_} disabled={loading} className="w-100">
                    Update Website
                  </Button>
                </td>
              </tr>
            </tbody>
          </Table>

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
