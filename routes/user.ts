import express from "express";
import userController from "../controllers/user";
import auth from "../middlewares/auth";

const router = express.Router();

/* Super Admin User end points */
/* For Creating New Super Admin Users */
router.post("/signup", userController.signup);
/* For Sign */
router.post("/signin", userController.signin);

/* Token Protected Routes */

/* Super Admin User Rest API Routes */

/* For Create New User as */
router.post("/", [auth.verifyToken, auth.isSuperAdmin], userController.signup);
/* For Edit User */
router.put(
  "/:id",
  [auth.verifyToken, auth.isSuperAdmin],
  userController.editUser
);
/* For Delete User */
router.delete(
  "/:id",
  [auth.verifyToken, auth.isSuperAdmin],
  userController.deleteUser
);
/* For List User */
router.get(
  "/",
  [auth.verifyToken, auth.isSuperAdminOrClient],
  userController.listUsers
);
/* For Change Status active / inactive */
router.patch(
  "/:id",
  [auth.verifyToken, auth.isSuperAdmin],
  userController.patchUserStatus
);

/* Restricted Routes Only Admin Can Access */

export default router;
