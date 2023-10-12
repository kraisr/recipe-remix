// import AWS from 'aws-sdk';

// const uploadImageToS3 = async (image, bucketName, key) => {
    
//   // Initialize S3 client
//   const s3 = new AWS.S3({
//     region: 'us-east-1', // Replace with your AWS region
//     accessKeyId: 'AKIAXGUOMVWBK7RQWCPT', // Replace with your AWS access key
//     secretAccessKey: 'pAkcyl5MDFIp32j+ZkKMefUDAwIWs1JSnFlYppS3', // Replace with your AWS secret key
//   });

//   const imageBlob = new Blob([image]);

//   // Prepare the parameters for the S3 upload
//   const params = {
//     Bucket: bucketName,
//     Key: key,
//     Body: imageBlob,
//     ContentType: image.type,
//     ACL: 'public-read', // Make the uploaded image publicly accessible
//   };

//   try {
//     // Upload the image to S3
//     const uploadResult = await s3.upload(params).promise();

//     // Return the URL of the uploaded image
//     return uploadResult.Location;
//   } catch (error) {
//     console.error('Error uploading image to S3:', error);
//     throw error; // Re-throw the error for handling at a higher level
//   }
// };

// export default uploadImageToS3;
