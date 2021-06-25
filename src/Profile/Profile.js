import React, { useState, useEffect } from "react"
import { Image, Container, Table } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import Header from '../Widgets/Header'

export default function UpdateProfile() {
    
    const [bio, setBio] = useState("")
    const [website, setWebsite] = useState("")
    const { currentUser,getUserDocReference } = useAuth()

    async function setBio_() {
        try {
            const docRef = await getUserDocReference(currentUser.uid)
            setBio(docRef.data().bio)
        } catch (err) {
            console.log(err.message);
        } finally {

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
                    <Table striped bordered hover responsive >
                        <thead>
                            <tr align="center">
                                <th >
                                    <Image src={currentUser.photoURL} rounded
                                        height="200px" width="200px" alt="We can't find your profile picture. Kindly re-upload it."
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Name</th>
                            </tr>
                            <tr>
                                <td>{currentUser.displayName != null ? currentUser.displayName.toString() : "null"}</td>
                            </tr>
                            <tr>
                                <th>Bio</th>
                            </tr>
                            <tr>
                                <td>{bio}</td>
                            </tr>
                            <tr>
                                <th>Website</th>
                            </tr>
                            <tr>
                                <td><a href={website}>{website}</a></td>
                            </tr>
                            <tr>
                                <th>Email</th>
                            </tr>
                            <tr>
                                <td >{currentUser.email != null ? currentUser.email.toString() : "null"}</td>
                            </tr>
                            <tr>
                                <th>Email Verified</th>
                            </tr>
                            <tr>
                                <td>{currentUser.emailVerified != null ? currentUser.emailVerified.toString() : "null"}</td>
                            </tr>
                            <tr>
                                <th>UID</th>
                            </tr>
                            <tr>
                                <td>{currentUser.uid != null ? currentUser.uid.toString() : "null"}</td>
                            </tr>

                            <tr>
                                <th>Photo URL</th>
                            </tr>
                            <tr>
                                <td><a href={currentUser.photoURL != null ? currentUser.photoURL.toString() : "null"} >Click Me</a></td>
                            </tr>


                        </tbody>
                    </Table>
                </div>
            </Container>
        </>
    )
}
