import React from "react"
import { Image, Container, Table } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import Header from './Header'

export default function UpdateProfile() {

    const { currentUser } = useAuth()
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
                                        height="100px" width="100px"
                                    />
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <th>Email</th>
                            </tr>
                            <tr>
                                <td >{currentUser.email != null ? currentUser.email.toString() : "null"}</td>
                            </tr>
                            <tr>
                                <th>Name</th>
                            </tr>
                            <tr>
                                <td>{currentUser.displayName != null ? currentUser.displayName.toString() : "null"}</td>
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
                                <td><a href={currentUser.photoURL != null ? currentUser.photoURL.toString() : "null"} >{currentUser.photoURL != null ? currentUser.photoURL.toString() : "null"}</a></td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </Container>
        </>
    )
}
