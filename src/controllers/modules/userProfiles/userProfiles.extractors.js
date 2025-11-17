module.exports = {
  extractBasic(data) {
    return {
      bio: data.bio,
      birthday: data.birthday ? new Date(data.birthday) : null,
      gender: data.gender,
      orientation: data.orientation,
      orientationOther: data.orientationOther,
      pronoun: data.pronoun,
      pronounOther: data.pronounOther,
      heightCm: data.heightCm,
      zodiac: data.zodiac,
      zodiacOther: data.zodiacOther,
    };
  },

  extractLocation(data) {
    return {
      latitude: data.latitude,
      longitude: data.longitude,
      city: data.city,
      state: data.state,
      country: data.country,
    };
  },

  extractLifestyle(data) {
    return {
      pets: data.pets,
      petsOther: data.petsOther,
      drinking: data.drinking,
      smoking: data.smoking,
      activityLevel: data.activityLevel,
      communication: data.communication,
      communicationOther: data.communicationOther,
    };
  },

  extractWork(data) {
    return {
      jobTitle: data.jobTitle,
      company: data.company,
      education: data.education,
      educationLevel: data.educationLevel,
      educationOther: data.educationOther,
      livingIn: data.livingIn,
    };
  },

  extractRelation(data) {
    return {
      intention: data.intention,
      intentionOther: data.intentionOther,
      relationshipType: data.relationshipType,
      relationshipOther: data.relationshipOther,
    };
  },

  extractInterests(data) {
    return {
      languages: data.languages,
      interestsActivities: data.interestsActivities,
      interestsLifestyle: data.interestsLifestyle,
      interestsCreativity: data.interestsCreativity,
      interestsSportsFitness: data.interestsSportsFitness,
      interestsMusic: data.interestsMusic,
      interestsNightlife: data.interestsNightlife,
      interestsTvCinema: data.interestsTvCinema,
    };
  },

  extractExtra(data) {
    return {
      photo: data.photo,
    };
  },
};
