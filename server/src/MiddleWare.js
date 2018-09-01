import jwt from 'jsonwebtoken';

export function M1_fun(req, res, next) {
    console.log('M1_Fun');
    next();
}

export function M2_fun(req, res, next) {
    console.log('M2_Fun');
    next();
}

export function chkToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        let bearer = bearerHeader.split(' ');
        let token = bearer[1];
        // req.token = token;
        jwt.verify(token, 'jwt_key', (err, authData) => {
            if (err) {
                res.json({
                    message: "Not pass",
                    err
                });
            } else {
                res.json({
                    message: "pass",
                    authData
                });
            }
        })
        next();
    } else {
        res.json({
            err: "No jwt setup"
        });
    }
}

export function genJWT(req, res, next) {
    let user = {
        username: 'testing'
    }
    req.token = jwt.sign({ user }, 'jwt_key');
    next();
}

export default {
    M1_fun,
    M2_fun,
    chkToken,
    genJWT
}