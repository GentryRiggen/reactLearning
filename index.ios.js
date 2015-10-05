'use strict';

var React = require('react-native'),
    Login = require('./Login'),
    AppContainer = require('./AppContainer'),
    AuthService = require('./AuthService');
var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    ActivityIndicatorIOS
    } = React;

var GithubBrowser = React.createClass({
    componentDidMount: function() {
        AuthService.getAuthInfo((err, authInfo) => {
            this.setState({
                checkingAuth: false,
                isLoggedIn: authInfo != null
            });
        });
    },

    render: function () {
        if (this.state.checkingAuth) {
            return <View style={styles.container}>
                <ActivityIndicatorIOS
                    animated={true}
                    size="large"
                    style={styles.loader} />
            </View>
        }

        if (this.state.isLoggedIn) {
            return (<AppContainer />);
        }

        return (
            <Login onLogin={this.onLogin}/>
        );
    },
    onLogin: function () {
        console.log('User Logged in');
        this.setState({isLoggedIn: true});
    },
    getInitialState: function () {
        return {
            isLoggedIn: false,
            checkingAuth: true
        }
    }
});

var styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10
    }
});

AppRegistry.registerComponent('GithubBrowser', () => GithubBrowser);
