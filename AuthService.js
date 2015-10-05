var buffer = require('buffer'),
    AsyncStorage = require('react-native').AsyncStorage,
    _ = require('lodash');

const authKey = 'auth';
const userKey = 'user';

class AuthService {
    getAuthInfo(cb) {
        AsyncStorage.multiGet([authKey, userKey], (err, val)=> {
            if (err) {
                cb(err);
            }

            if (!val) {
                cb();
            }

            var zippedObject = _.zipObject(val);

            if (!zippedObject[authKey]) {
                return cb();
            }

            var authInfo = {
                headers: {
                    Authorization: 'Basic ' + zippedObject[authKey]
                },
                user: JSON.parse(zippedObject[userKey])
            };

            console.log('AuthInfo', authInfo);

            return cb(null, authInfo);
        });
    }

    login(creds, cb) {
        var b = buffer.Buffer(creds.username + ':' + creds.password),
            encodedCreds = b.toString('base64');

        fetch('https://api.github.com/user', {
            headers: {
                'Authorization': 'Basic ' + encodedCreds
            }
        }).then((response)=> {
            if (response.status >= 200 && response.status < 300) {
                return response;
            }

            throw {
                badCredentials: response.status == 401,
                unkownError: response.status != 401
            };
        }).then((response)=> {
            console.log('response: ', response);
            AsyncStorage.multiSet([
                [authKey, encodedCreds],
                [userKey, response._bodyText]
            ], (err)=> {
                console.log('AsyncStorage err', err);
                if (err) {
                    throw err;
                }
                return response.json();
            });
        }).then(()=> {
            cb({success: true});
        }).catch((err)=> {
            console.log('Failed Login: ' + err);
            cb(err);
        });
    }
}

module.exports = new AuthService();