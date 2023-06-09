const User = require('../../models/User');

const getUserFullNameSlug = async (newSlug) => {
  let userCount = await User.countDocuments({ slug: newSlug });
  let slugCount = 1;

  let tempUserSlug = newSlug;

  while (userCount >= 1) {
    tempUserSlug = `${newSlug}${slugCount}`;
    // eslint-disable-next-line no-await-in-loop
    userCount = await User.countDocuments({ slug: tempUserSlug });
    slugCount += 1;
  }

  return tempUserSlug;
};

module.exports = {
  getUserFullNameSlug,
};
