import React from "react"
import Header from '../Widgets/Header'
import { Container, Alert } from 'react-bootstrap'


export default function Dashboard() {


  return (
    <>
      <Header />
      <div style={{ backgroundImage: "url(/dashboard-background.jpg)", height: "100vh", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
        <Container className="d-flex align-items-center justify-content-center" >
          <div className="w-100" style={{ maxWidth: "450px", marginTop: 50 }}>
            <Alert variant="primary" >
              <h3>
                Kindly go to different modules (like <a href="/grid">grid</a>,<a href="/profile">profile</a>) to see them.
              </h3>
            </Alert>

          </div>
        </Container>

      </div>

    </>
  )
}
