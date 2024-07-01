const express = require("express")

const router = express.Router()

const {registerUser,getAllUsers,getUser,updateUser,loginUser,userProfile, forgotPassword, resetPassword, changePassword, deleteUser, updateOwnDetails, logout, addHolidays} = require("../controllers/userController.js")

const {giveAttendence, displayAttendence, displayAllAttendence, displayLogs, exportReport} = require("../controllers/attendenceController.js")

const {isAuthenticated,auhtorizeRole} = require("../middleware/authenticate.js")

router.route("/admin/users/register").post(registerUser)
router.route("/admin/getAllUsers").get(isAuthenticated,auhtorizeRole('admin'),getAllUsers)
router.route("/admin/getUser/:email").get(getUser)
router.route("/admin/updateUser").put(updateUser)
router.route("/admin/deleteuser").delete(isAuthenticated,auhtorizeRole('admin'),deleteUser)
router.route("/users/login").post(loginUser)


router.route("/users/profile/:email").get(userProfile)
router.route("/users/giveAttendence/:email").post(giveAttendence)
router.route("/users/displayAttendence/:email").get(displayAttendence)
// router.route("/users/forgotPassword").post(forgotPassword)
// router.route("/users/resetPassword/:token").post(resetPassword)
// router.route("/users/changepassword").post(isAuthenticated,changePassword)
// router.route("/users/updateowndetails").put(isAuthenticated,updateOwnDetails)
router.route("/users/logout/:id").post(logout)
router.route("/admin/addHolidays").patch(addHolidays)


router.route("/admin/export/:email").post(exportReport)

router.route("/admin/displayAllAttendence").get(isAuthenticated,auhtorizeRole('admin'),displayAllAttendence)
router.route("/admin/displayLogs").get(displayLogs)


module.exports =router