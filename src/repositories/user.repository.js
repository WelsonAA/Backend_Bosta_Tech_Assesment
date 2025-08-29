// repositories/user.repository.js
const User = require("../models/user.model");

class UserRepository {
  async findByEmail(email) {
    return User.findOne({ where: { email } });
  }

  async create(data) {
    return User.create(data);
  }

  async findAndCount({ attributes, limit, offset }) {
    return User.findAndCountAll({
      attributes,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });
  }

  async findByPublicId(public_id, attributes = null) {
    return User.findOne({
      attributes: attributes || undefined,
      where: { public_id },
    });
  }

  async updateByPublicId(public_id, updates) {
    return User.update(updates, { where: { public_id } });
  }

  async deleteByPublicId(public_id) {
    return User.destroy({ where: { public_id } });
  }
}

module.exports = new UserRepository();
