import React, { useState } from "react"
import { Button, Navbar, Nav, Alert } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import { useHistory } from "react-router-dom"

export default function Header() {
    const [error, setError] = useState("")
    const { logout } = useAuth()
    const history = useHistory()

    async function handleLogout() {
        setError("")

        try {
            await logout()
            history.push("/login")
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <>
            {error && <Alert variant="danger">{error}</Alert>}
            <Navbar bg="dark" variant="dark" expand="lg">
                <Navbar.Brand href="/">Dashboard</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link href="/grid">Grid</Nav.Link>
                        <Nav.Link href="/profile">Profile</Nav.Link>
                        <Nav.Link href="/update-profile">Update Profile</Nav.Link>
                        <Nav.Link href="/administration">Administration</Nav.Link>
                    </Nav>
                    <Button variant="secondary" onClick={handleLogout}>Logout</Button>
                </Navbar.Collapse>
            </Navbar>
        </>
    )
}