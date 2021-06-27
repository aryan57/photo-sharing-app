import Resizer from "react-image-file-resizer";

const resizeImage = (file) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            512,
            512,
            "PNG",
            50, // quality -> 0 low quality, 100 high quality
            0,
            (uri) => {
                resolve(uri);
            },
            "file"
        );
    });

export default resizeImage;