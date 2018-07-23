const signup = async (req, res) => {
    const signupRes = { ...req.user };
    res.status(signupRes.status).send(signupRes);
};

const UserController = {
    signup,
};

export default UserController;
