exports.toUserDTO = (user) => {
    return {
        id: user._id,
        username: user.username,
        admin: user.admin
    };
};