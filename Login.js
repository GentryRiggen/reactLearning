'use strict';

var React = require('react-native');

var {
    AppRegistry,
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableHighlight,
    Component,
    ActivityIndicatorIOS
    } = React;

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            username: '',
            password: '',
            showProgress: false
        }
    }

    render() {
        var errorCtrl = <View />;
        if (!this.state.success && this.state.badCredentials) {
            errorCtrl = <Text style={styles.error}>
                That username and password combination did not work
            </Text>
        } else if (!this.state.success && this.state.unkownError) {
            errorCtrl = <Text style={styles.error}>
                Something went wrong
            </Text>
        }

        return (
            <View style={styles.container}>
                <Image style={styles.logo}
                       source={require('image!Octocat')}/>
                <Text style={styles.heading}>
                    Github Browser
                </Text>

                <TextInput
                    onChangeText={(text)=> this.setState({username: text})}
                    style={styles.input}
                    placeholder="Github username"/>
                <TextInput
                    onChangeText={(text)=> this.setState({password: text})}
                    style={styles.input}
                    placeholder="Github password"
                    secureTextEntry={true}/>

                <TouchableHighlight
                    onPress={this.onLoginPressed.bind(this)}
                    style={styles.button}>
                    <Text style={styles.buttonText}>
                        Log in
                    </Text>
                </TouchableHighlight>

                {errorCtrl}

                <ActivityIndicatorIOS
                    animating={this.state.showProgress}
                    size="large"
                    style={styles.loader}/>
            </View>
        );
    }

    onLoginPressed() {
        console.log('Attempting Login with username: ' + this.state.username);
        this.setState({showProgress: true});
        var authService = require('./AuthService');
        authService.login({
            username: this.state.username,
            password: this.state.password
        }, (results)=> {
            console.log('results: ', results);
            this.setState(Object.assign({
                showProgress: false
            }, results));

            if (results.success && this.props.onLogin) {
                this.props.onLogin();
            }
        });
    }
}


var styles = StyleSheet.create({
    container: {
        backgroundColor: '#F5FCFF',
        flex: 1,
        paddingTop: 40,
        alignItems: 'center',
        padding: 10
    },
    logo: {
        width: 66,
        height: 66
    },
    heading: {
        fontSize: 30,
        marginTop: 10
    },
    input: {
        height: 50,
        marginTop: 10,
        padding: 4,
        fontSize: 18,
        borderWidth: 1,
        borderColor: '#48bbec'
    },
    button: {
        marginTop: 10,
        height: 50,
        backgroundColor: '#48bbec',
        alignSelf: 'stretch',
        justifyContent: 'center'
    },
    buttonText: {
        fontSize: 22,
        color: '#FFF',
        alignSelf: 'center'
    },
    loader: {
        marginTop: 20
    },
    error: {
        color: 'red',
        paddingTop: 10
    }
});

module.exports = Login;