'use strict';

var React = require('react-native'),
    Login = require('./Login'),
    AuthService = require('./AuthService'),
    Feed = require('./Feed');
var {
    Text,
    View,
    Component,
    StyleSheet,
    TabBarIOS
    } = React;

class AppContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: 'feed'
        }
    }

    render() {
        return (
            <TabBarIOS style={styles.tabContainer}>
                <TabBarIOS.Item
                    title="Feed"
                    selected={this.state.selectedTab == 'feed'}
                    icon={require('image!inbox')}
                    onPress={()=> this.setState({selectedTab: 'feed'})}>

                    <Feed />
                </TabBarIOS.Item>

                <TabBarIOS.Item
                    title="Search"
                    selected={this.state.selectedTab == 'search'}
                    icon={require('image!search')}
                    onPress={()=> this.setState({selectedTab: 'search'})}>

                    <Text style={styles.welcome}>Tab 2</Text>
                </TabBarIOS.Item>
            </TabBarIOS>
        );
    }
}

var styles = StyleSheet.create({
    tabContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF'
    },
    welcome: {
        fontSize: 20,
        marginTop: 20,
        textAlign: 'center',
        margin: 10
    }
});

module.exports = AppContainer;