const service = require("../services/profile.service");

exports.listProfiles = async (req, res) => {
  const page = parseInt(req.query.page || "1");
  const limit = parseInt(req.query.limit || "20");
  const result = await service.listProfiles(page, limit);
  res.json(result);
};

exports.getProfile = async (req, res) => {
  const profile = await service.getProfile(req.params.userId);
  res.json(profile);
};

exports.createProfile = async (req, res) => {
  const profile = await service.createProfile(req.params.userId, req.body);
  res.json(profile);
};

exports.updateProfile = async (req, res) => {
  const profile = await service.updateProfile(req.params.userId, req.body);
  res.json(profile);
};

exports.deleteProfile = async (req, res) => {
  await service.deleteProfile(req.params.userId);
  res.json({ success: true });
};
