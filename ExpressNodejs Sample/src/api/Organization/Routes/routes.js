const express = require("express");
const router = express.Router();

const OrganizationController = require("../Controllers/OrganizationController");
router.post("/create", OrganizationController.createOrganization);

router.get("/findAll", OrganizationController.getOrganizations);

router.get("/:id/find", OrganizationController.getOrganization);

router.delete("/:id/delete", OrganizationController.deleteOrganization);

router.patch("/:id/update", OrganizationController.updateOrganization);

module.exports = router;
