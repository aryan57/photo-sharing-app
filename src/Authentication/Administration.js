import React, { useState } from "react"
import { Button, Alert, Container } from "react-bootstrap"
import { useAuth } from "../contexts/AuthContext"
import Header from '../Widgets/Header'


export default function Administration() {

    const {currentUser, sendEmailVerification, deleteUser, logout } = useAuth()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")
    const [loading, setLoading] = useState(false)

    async function sendEmailVerificationFunction() {

        if(currentUser.emailVerified) {
            setMessage("You are already verified!")
            return
        }

        setError("")
        setMessage("")
        setLoading(true)
        try {
            await sendEmailVerification()
            setMessage("Email verification sent!")
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }
    async function deleteUserFunction() {

        setError("")
        setMessage("")
        setLoading(true)

        try {
            await deleteUser()
            setMessage("User Deleted!")
            await logout()
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
                <div className="w-100" style={{ maxWidth: "450px", marginTop: 50 }}>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {message && <Alert variant="success">{message}</Alert>}
                    <Button disabled={loading} className="w-100" onClick={sendEmailVerificationFunction}>
                        Send Email Verification Link
                    </Button>
                    <Button disabled={loading} className="w-100 mt-4 btn-danger" onClick={deleteUserFunction}>
                        Delete Account
                    </Button>
                </div>
            </Container>
        </>
    )
}