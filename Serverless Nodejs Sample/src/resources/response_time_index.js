const esClient = require("../resources/elasticconfig");

exports.checkIndices = async () => {
  esClient.exists({ index: "device_response" }, (err, res, status) => {
    if (res) {
      console.log("Index already exists");
    } else {
      esClient.indices.create(
        { index: "device_response" },
        (err, res, status) => {
          if (err) {
            console.log("Error creating new index");
          } else {
            console.log("Created new index");
          }
        }
      );
    }
  });
};

function putMapping() {
  return new Promise((resolve, reject) => {
    console.log("Creating Mapping index");
    esClient.indices.putMapping(
      {
        index: "device_response_time",
        type: "time",
        body: {
          properties: {
            timestamp: { type: "text" },
            device_uid: { type: "text" },
            endpoint: { type: "text" },
            response_time: { type: "text" },
          },
        },
      },
      (err, resp, status) => {
        if (err) {
          console.error(err, status);
          reject("Error creating mapping");
        } else {
          console.log("Successfully Created Index", status, resp);
          resolve("Maopping created: ", status, " : ", resp);
        }
      }
    );
  });
}
