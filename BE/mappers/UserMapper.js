exports.toUserDTO = (user) => {
    return {
        id: user.id,
        username: user.username,
        admin: user.admin
    };
};