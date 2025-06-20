const ranges = {
  username: {
    min: 4,
    max: 15,
  },
  password: {
    min: 8,
    max: 255,
  },
  commentText: {
    min: 1,
    max: 280,
  },
  postTitle: {
    min: 1,
    max: 100,
  },
  postText: {
    min: 1,
    max: 1200,
  },
};

const invalidLengthMessage = (fieldname, range) => {
  return `${fieldname} is required to be between ${range.min} and ${range.max} characters.`;
};

module.exports = { ranges, invalidLengthMessage };
