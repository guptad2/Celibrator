const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: "AKIAU4LAKYYRWTTMUTTH",
  secretAccessKey: "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"
});

const putObject = (fileName, data) => {
  const putData = new Buffer(data, "binary");
  s3.putObject(
    {
      Bucket: "db75b70c-f6a0-4144-9c87-c2bb80f34f6c",
      Key: fileName,
      Body: putData,
      ACL: "public-read"
    },
    function(resp) {
      console.log("Successfully uploaded package.", fileName);
    }
  );
};

module.exports = {
  putObject
};
