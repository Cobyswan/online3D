const axios = require('axios')

module.exports = {
    login: (req, res) => {
        const db = req.app.get('db')

        let redirect_uri = process.env.HOST
        ? 
        `http://${req.headers.host}/auth`
        :
        `https://${req.headers.host}/auth`

        const payload = {
            client_id: process.env.REACT_APP_CLIENT_ID,
            client_secret: process.env.AUTH0_CLIENT_SECRET,
            code: req.query.code,
            grant_type: 'authorization_code',
            redirect_uri
        }

        function tradeCodeForAccessToken() {
            return axios.post(`https://${process.env.REACT_APP_AUTH_DOMAIN}/oauth/token`, payload)
        }

        function tradeAccessTokenForUserInfo(accessTokenResponse){
            const accessToken = accessTokenResponse.data.access_token
            return axios.get(`https://${process.env.REACT_APP_AUTH_DOMAIN}/userinfo/?access_token=${accessToken}`)
        }

        function storeUserInfoInDB(userInfoRes){
            const userData = userInfoRes.data
            return db.get_user_by_id(userData.sub).then(user => {
                if(user.length){
                    req.session.user = user[0];
                    res.redirect('/');
                }
                else {
                    const createdUser = [
                        userData.sub,
                        userData.email,
                        userData.name,
                        userData.picture
                    ];
                    return db.create_user(createdUser).then(newUser => {
                        const user = newUser[0];
                        req.session.user = user
                        res.redirect('/')
                    })
                }
            })
        }
        tradeCodeForAccessToken().then(tradeAccessTokenForUserInfo).then(storeUserInfoInDB).catch(err => console.log(err, 'access token error'))
    },
    
    getUserData(req, res){
        res.status(200).json(req.session.user)
    },
    logout: (req, res) => {
        req.session.destroy();
        res.status(200).send(null)
    }
}