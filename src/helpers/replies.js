const ReplyFactory = (
    { reply },
    success = true,
    status = 200,
    message = "Your request was successful",
    data = []) => {
    return reply.status(status).send({ success, data, message }).hijack();
}

const invalidToken = ({ reply }) => {
    return ReplyFactory({ reply }, false, 400, "Invalid or expired token ");
}

const noAuthTokenProvided = ({ reply }) => {
    return ReplyFactory({ reply }, false, 400, "Authentication credentials were not provided")
}

const routeNotSetYet = ({ reply }) => {
    return ReplyFactory(
        { reply },
        false,
        404,
        "This route is not configured yet"
    );
};

const Handler404 = async (request, reply) => {
    return routeNotSetYet({ reply });
};

module.exports = { Handler404, invalidToken, noAuthTokenProvided }