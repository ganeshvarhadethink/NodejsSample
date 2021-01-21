const elasticsearch = require("elasticsearch");

const awsHttpClient = require("http-aws-es");

const AWS = require("aws-sdk");
AWS.config.region = process.env.es_region;

const client = new elasticsearch.Client({
  host: process.env.es_host,
  connectionClass: awsHttpClient,
  amazonES: {
    //region: "us-east-1",
    credentials: new AWS.Credentials(
      process.env.aws_access_key,
      process.env.aws_secret_key
    ),
  },
});

module.exports = client;
