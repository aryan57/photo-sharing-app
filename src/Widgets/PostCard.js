import React from "react"
import { Card, Button, Badge } from 'react-bootstrap'

const PostCard = ({userName="", postMediaURL="", postCaption="", timestamp=""}) => {

    // const [isCompleted, setIsCompleted] = useState(false);
    return(
        <Card style={{ marginTop: "15px" }}>
            <Card.Header >
              <div style={{display: "flex" , justifyContent:"space-between"}}>
                <div>
                  <h5>{userName}</h5>
                </div>
                <div>
                  {timestamp}
                </div>
              </div>
              {/* {userName} */}
            </Card.Header>
            <Card.Img variant="top" src={postMediaURL} alt={"Error in retrieving "+userName+"'s photo"} />
            <Card.Body>
              <Card.Text>
                {postCaption}
              </Card.Text>
              {/* <Button variant="primary">
                Like
                <Badge style={{ marginLeft: "10px" }} variant="light">9</Badge>
              </Button>
              <Button variant="primary" style={{ marginLeft: "15px" }} >
                See Comments
                <Badge style={{ marginLeft: "10px" }}  variant="light">4</Badge>
              </Button> */}
            </Card.Body>
          </Card>
    )
}

export default PostCard;