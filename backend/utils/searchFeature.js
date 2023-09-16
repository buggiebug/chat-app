module.exports = class SearchFeature {
  constructor(query) {
    this.query = query;
  }

  //  Search user by name/email...
  findUsers(queryStr, curUserId) {
    const keyword = queryStr.search
      ? {
          $or: [
            { name: { $regex: String(queryStr.search), $options: "i" } },
            { email: { $regex: String(queryStr.search), $options: "i" } },
          ],
        }
      : {};
    this.query = this.query
      .find({ ...keyword, isVerifiedUser: true })
      .find({ _id: { $ne: curUserId } })
      .select("-passwordToken");
    return this.query;
  }
};
