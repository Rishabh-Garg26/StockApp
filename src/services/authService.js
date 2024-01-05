const logIn = async () => {
    return {
        status: "success",
        message: "You are redirecting to home page",
    };
};

const logOut = async () => {
    return {
        status: "success",
        message: "You are logged out",
    };
};
export default {
    logIn,
    logOut,
};