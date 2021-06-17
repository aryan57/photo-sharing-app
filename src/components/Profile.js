import React, { useRef, useState } from "react"
import { Image, Container, Table } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { Link, useHistory } from "react-router-dom"
import Header from './Header'

export default function UpdateProfile() {
    const emailRef = useRef()
    const passwordRef = useRef()
    const passwordConfirmRef = useRef()
    const { currentUser, updatePassword, updateEmail } = useAuth()
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const history = useHistory()

    function handleSubmit(e) {
        e.preventDefault()
        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError("Passwords do not match")
        }

        const promises = []
        setLoading(true)
        setError("")

        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }
        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(promises)
            .then(() => {
                history.push("/")
            })
            .catch((err) => {
                setError(err.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    console.log(currentUser);

    return (
        <>
            <Header />
            <Container className="d-flex align-items-center justify-content-center">
                <div className="w-100" 
                
                style={{ maxWidth: "500px",marginTop:50 }}
                
                >



                    <Table striped bordered hover>
                        <thead>
                            <tr align="center">
                                <th colSpan="2" >
                                <Image src={currentUser.photoURL} rounded height="200px" width="200px"/>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Email</th>
                                <td>{currentUser.email != null ? currentUser.email.toString() : "null"}</td>
                            </tr>
                            <tr>
                                <th>Name</th>
                                <td>{currentUser.displayName != null ? currentUser.displayName.toString() : "null"}</td>
                            </tr>
                            <tr>
                                <th>Email Verified</th>
                                <td>{currentUser.emailVerified != null ? currentUser.emailVerified.toString() : "null"}</td>
                            </tr>
                            <tr>
                                <th>UID</th>
                                <td>{currentUser.uid != null ? currentUser.uid.toString() : "null"}</td>
                            </tr>
                            <tr>
                                <th>Photo URL</th>
                                <td>{currentUser.photoURL != null ? currentUser.photoURL.toString() : "null"}</td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </Container>
        </>
    )
}
