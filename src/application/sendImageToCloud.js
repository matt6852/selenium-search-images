const Minio = require("minio");

const minioClient = new Minio.Client({
  endPoint: "minio.intexco.org",
  // port: 9001, coment to work
  // useSSL: true, coment to work
  accessKey: "oCAjR3wX9jfSEM8z",
  secretKey: "bq1Hvlvv3yktPDuLdeb95pPOIj3QEjAG",
});

// test Minio

// const minioClient = new Minio.Client({
//   endPoint: "play.min.io",
//   port: 9000,
//   useSSL: true,
//   accessKey: "Q3AM3UQ867SPQQA43P2F",
//   secretKey: "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG",
// });

module.exports = minioClient;
