const repo = require("../repositories/profile.repository");
const { validateEnum } = require("../utils/enums");

exports.listProfiles = async (page, limit) => {
  return repo.listProfiles(page, limit);
};

exports.getProfile = async (userId) => {
  return repo.getProfile(userId);
};

exports.createProfile = async (userId, data) => {
  validateEverything(data);
  return repo.createProfile(userId, data);
};

exports.updateProfile = async (userId, data) => {
  validateEverything(data);
  return repo.updateProfile(userId, data);
};

exports.deleteProfile = async (userId) => {
  return repo.deleteProfile(userId);
};

// validação centralizada
function validateEverything(data) {
  validateEnum("Pronoun", data.pronoun);
  validateEnum("Intention", data.intention);
  validateEnum("RelationshipType", data.relationshipType);
  validateEnum("EducationLevel", data.educationLevel);
  validateEnum("SmokingStatus", data.smoking);
  validateEnum("DrinkingStatus", data.drinking);
  validateEnum("ActivityFrequency", data.activityLevel);
  validateEnum("PetsPreference", data.pets);
  validateEnum("CommunicationStyle", data.communication);
  validateEnum("ZodiacSign", data.zodiac);
  validateEnum("SexualOrientation", data.orientation);
}
