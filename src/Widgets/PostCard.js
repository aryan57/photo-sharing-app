import React from "react"
import { Card, Button, Badge } from 'react-bootstrap'

const PostCard = ({userName="aryan57", postMediaURL="https://sample-videos.com/img/Sample-jpg-image-50kb.jpg", postCaption="Some quick example text to build on the card title and make up the bulk of the card's content."}) => {

    // const [isCompleted, setIsCompleted] = useState(false);
    return(
        <Card style={{ marginTop: "15px" }}>
            <Card.Header as="h5">@{userName}</Card.Header>
            <Card.Img variant="top" src={postMediaURL} alt={"Error in retrieving "+userName+"'s photo"} />
            <Card.Body>
              <Card.Text>
                {postCaption}
              </Card.Text>
              <Button variant="primary">
                Like
                <Badge style={{ marginLeft: "10px" }} variant="light">9</Badge>
              </Button>
              <Button variant="primary" style={{ marginLeft: "15px" }} >
                See Comments
                <Badge style={{ marginLeft: "10px" }}  variant="light">4</Badge>
              </Button>
            </Card.Body>
          </Card>
    )
}

export default PostCard;