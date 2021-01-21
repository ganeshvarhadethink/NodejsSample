require("dotenv").config();
const request = require("request-promise");
const jwkToPem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");

const pool_region = "us-west-2";
exports.Validate = async (event, context, callback) => {
  const authHeader = event.authorizationToken;
  console.log("Validate Token", authHeader);
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return callback(null, "Unauthorized");
  await request({
    url: `https://cognito-idp.${pool_region}.amazonaws.com/${process.env.UserPoolId}/.well-known/jwks.json`,
    json: true,
  })
    .then((response) => {
      pems = {};
      var keys = response["keys"];
      for (var i = 0; i < keys.length; i++) {
        var key_id = keys[i].kid;
        var modulus = keys[i].n;
        var exponent = keys[i].e;
        var key_type = keys[i].kty;
        var jwk = { kty: key_type, n: modulus, e: exponent };
        var pem = jwkToPem(jwk);
        pems[key_id] = pem;
      }
      var decodedJwt = jwt.decode(token, { complete: true });
      if (!decodedJwt) {
        return callback("Unauthorized");
      }
      var kid = decodedJwt.header.kid;
      var pem = pems[kid];
      if (!pem) {
        return callback("Unauthorized");
      }
      jwt.verify(token, pem, function (err, payload) {
        if (err) {
          return callback("Unauthorized");
        } else {
          return callback(
            null,
            generatePolicy(payload.sub, "Allow", event.methodArn)
          );
        }
      });
    })
    .catch((err) => {
      return callback(null, err.message);
    });
};

const generatePolicy = (principalId, effect, resource) => {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = "2012-10-17";
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = "execute-api:Invoke";
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
};
exports.replyToApi = function (message, statusCode) {
  return (Response = {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "*",
      "Content-Type": "application/json",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Credentials": true,
      preflightContinue: true,
    },
    body: message,
  });
};
