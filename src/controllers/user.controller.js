const signup = async (req, res) => {
    res.status(req.user.status).send(req.user);
};

const UserController = {
    signup,
};

export default UserController;
