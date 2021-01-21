require("dotenv").config();
const request = require("request-promise");
const jwkToPem = require("jwk-to-pem");
const jwt = require("jsonwebtoken");

const pool_region = "us-east-1";
exports.Validate = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("token", token);
  if (token == null) return res.sendStatus(401);
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
        res.status(401);
        return res.send("Please enter a valid token");
      }
      var kid = decodedJwt.header.kid;
      var pem = pems[kid];
      if (!pem) {
        res.status(401);
        return res.send("Please enter a valid token");
      }
      jwt.verify(token, pem, function (err, payload) {
        if (err) {
          res.status(401);
          return res.send(err.message);
        } else {
          console.log("Valid Token.");
          return next();
        }
      });
    })
    .catch((err) => {
      console.log("Error! Unable to download JWKs", err);
      res.status(500);
      return res.send("Error! Unable to download JWKs");
    });
};
