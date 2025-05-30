const cloudinary = require('cloudinary').v2;

cloudinary.config({
     
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.API_SECRET
  });


/*  cloud_name: 'dvqefzdqw', 
    api_key: '688443793181515',       
    api_secret: 'Y1EyB9P507ExSJ_SxqU5UPUrlTc' */
const uploadImg = (fileBuffer, publicId) => {    
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { publicId },
            (error, uploadResult) => {
                if (error) {
                    return reject({ error: "Upload failed", details: error });
                }
                else{
                    resolve(uploadResult.secure_url);
                }
            }
        );
        uploadStream.end(fileBuffer);
    })
}


module.exports = {
    uploadImg
}
