// controllers/user.controller.js
const userService = require("../services/user.service");

class UserController {
  async register(req, res,next) {
    try {
      const { email, password, name } = req.body;
      const user = await userService.register({ email, password, name });
      res.status(201).json({
        public_id: user.public_id,
        email: user.email,
        role: user.role,
      });
    } catch (err) {
      next(err);
    }
  }

  async getAll(req, res, next) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const result = await userService.getPaginatedUsers(page, limit);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async getOne(req, res, next) {
    try {
      const user = await userService.getUser(req.params.public_id);
      res.json(user);
    } catch (err) {
      next(err);
    }
  }

  async update(req, res, next) {
    try {
      const updatedUser = await userService.updateUser(req.params.public_id, req.body);
      res.json(updatedUser);
    } catch (err) {
      next(err);
    }
  }

  async promote(req, res, next) {
    try {
      const user = await userService.promoteToAdmin(req.params.public_id);
      res.json({ message: `${user.email} promoted to admin`, role: user.role });
    } catch (err) {
      next(err);
    }
  }

  async delete(req, res, next) {
    try {
      await userService.deleteUser(req.params.public_id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new UserController();
