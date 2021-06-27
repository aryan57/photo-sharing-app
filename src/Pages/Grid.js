import React, { useState, useRef, useEffect } from "react"
import Header from '../Widgets/Header'
import PostCard from '../Widgets/PostCard'
import { Container, Table, ProgressBar, Form, Button, Alert, FormControl, InputGroup } from 'react-bootstrap'
import resizeImage from "../Utilities/ResizeImage";

import firebase from "firebase/app"
import { db } from "../firebase"
import { useAuth } from "../contexts/AuthContext"

export default function Grid() {

    const [uploadProgress, setUploadProgress] = useState(0)
    const [posts, setPosts] = useState([])
    const [file, setFile] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const captionRef = useRef()

    const { currentUser,
        uploadFile,
        getDownloadURL,
        updatePostData,
        getUserPostDocReference
    } = useAuth()

    async function uploadNewPost_() {

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
            const docRef = await getUserPostDocReference(currentUser.uid)
            const fileExtension = contentType.substring(contentType.lastIndexOf('/') + 1)
            const firebaseFilepath = 'posts/' + currentUser.uid + '/' + docRef.id + '.' + fileExtension
            const uploadTask = uploadFile(firebaseFilepath, compressedFile, { contentType: contentType });

            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED, function (snapshot) {
                const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
                setUploadProgress(progress);
            });

            await uploadTask;
            setSuccess("Upload Successfull!")

            const newURL = await getDownloadURL(firebaseFilepath)
            const postData = {
                contentType: file.type,
                originalFileName: file.name,
                mediaURL: newURL,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                caption: captionRef.current.value,
                likes: 0,
                comments: [],
                authorName: currentUser.displayName,
            };

            await updateNewPostData_(docRef, postData)

        } catch (err) {
            setError(err.message)
        } finally {
            setUploadProgress(0);
            setLoading(false)
            captionRef.current.value = ""
        }
    }

    async function updateNewPostData_(docRef, postData) {
        try {
            await updatePostData(currentUser.uid, docRef, postData)
            setSuccess("Post added to your profile!")
        } catch (err) {
            setError(err.message)
        } finally {
        }
    }

    useEffect(() => {

        const unsubscribe =

            db
                .collection('userData')
                .doc(currentUser.uid.toString())
                .collection('posts')
                .orderBy("timestamp", "desc")
                .onSnapshot(snapshot => {

                    setPosts(snapshot.docs.map(doc => {
                        const jsonData = {
                            postMediaURL: doc.data().mediaURL,
                            postCaption: doc.data().caption,
                            docId: doc.id,
                            timestamp: (doc.data().timestamp ? doc.data().timestamp.toDate().toLocaleString('en-GB') : ""),
                            authorName: doc.data().authorName,
                        };
                        return jsonData;
                    }))

                }, (err) => {
                    setError(err.message)
                });
        return unsubscribe

    }, []);

    return (
        <>
            <Header />
            <Container className="d-flex align-items-center justify-content-center">
                <div className="w-100" style={{ maxWidth: "450px", marginTop: 50 }}>

                    <h2 className="text-center mb-4">Posts Grid</h2>
                    {error && <Alert variant="danger">{error}</Alert>}
                    {success && <Alert variant="success">{success}</Alert>}

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
                                            label={file ? file.name : "Choose Picture"}
                                            custom
                                            onChange={(e) => { setFile(e.target.files[0]) }}
                                        />
                                    </Form>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <InputGroup>
                                        <FormControl ref={captionRef} placeholder="Caption (Optional)" />
                                    </InputGroup>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Button disabled={loading} className="w-100" onClick={uploadNewPost_}>
                                        Add New Post
                                    </Button>
                                </td>
                            </tr>

                        </tbody>
                    </Table>

                    {
                        posts.map(post =>


                            <PostCard
                                userName={post.authorName}
                                key={post.docId}
                                postCaption={post.postCaption}
                                postMediaURL={post.postMediaURL}
                                timestamp={post.timestamp}
                            />

                        )
                    }





                </div>
            </Container>
        </>
    )
}
