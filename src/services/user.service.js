// services/user.service.js
const bcrypt = require("bcrypt");
const userRepository = require("../repositories/user.repository");

const SALT_ROUNDS = 10;
const SAFE_ATTRIBUTES = ["public_id", "name", "email", "role", "createdAt"];

class UserService {
  async register({ email, password, name }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new Error("Email already exists for another user");

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    return userRepository.create({
      name,
      email,
      password: hashed,
      role: "borrower",
    });
  }

  async getPaginatedUsers(page = 1, limit = 10) {
    const allowedLimits = [10, 20, 50];
    const perPage = allowedLimits.includes(limit) ? limit : 10;
    const offset = (page - 1) * perPage;

    const { count, rows } = await userRepository.findAndCount({
      attributes: SAFE_ATTRIBUTES,
      limit: perPage,
      offset,
    });

    return {
      users: rows,
      pagination: {
        total: count,
        page,
        perPage,
        totalPages: Math.ceil(count / perPage),
      },
    };
  }

  async getUser(public_id) {
    const user = await userRepository.findByPublicId(public_id, SAFE_ATTRIBUTES);
    if (!user) throw new Error("User not found");
    return user;
  }

  async updateUser(public_id, updates) {
    if ("role" in updates) delete updates.role;
    const [updated] = await userRepository.updateByPublicId(public_id, updates);
    if (!updated) throw new Error("User not found");
    return userRepository.findByPublicId(public_id, SAFE_ATTRIBUTES);
  }

  async promoteToAdmin(public_id) {
    const user = await userRepository.findByPublicId(public_id);
    if (!user) throw new Error("User not found");

    user.role = "admin";
    await user.save();
    return user;
  }

  async deleteUser(public_id) {
    const deleted = await userRepository.deleteByPublicId(public_id);
    if (!deleted) throw new Error("User not found");
  }
}

module.exports = new UserService();
