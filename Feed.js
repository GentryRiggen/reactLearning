'use strict';

var React = require('react-native'),
    Login = require('./Login'),
    AuthService = require('./AuthService'),
    moment = require('moment');
var {
    Text,
    View,
    Component,
    ListView,
    ActivityIndicatorIOS,
    Image
    } = React;

class Feed extends Component {
    constructor(props) {
        super(props);

        var ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => r1 != r2
        });
        this.state = {
            dataSource: ds.cloneWithRows([]),
            showProgress: true
        };
    }

    componentDidMount() {
        this.fetchFeed();
    }

    fetchFeed() {
        require('./AuthService').getAuthInfo((err, authInfo) => {
            var url = 'https://api.github.com/users/' +
                authInfo.user.login +
                '/received_events';

            console.log(url);

            fetch(url, {
                headers: authInfo.headers
            })
                .then((response)=> response.json())
                .then((responseData=> {
                    console.log(responseData);
                    var feedItems = responseData.filter((ev)=> ev.type == 'PushEvent');
                    this.setState({
                        dataSource: this.state.dataSource.cloneWithRows(feedItems),
                        showProgress: false
                    });
                }));
        })
    }

    renderRow(rowData) {
        return (
            <View style={{
            flex: 1,
            flexDirection: 'row',
            padding: 20,
            alignItems: 'center',
            borderColor: '#D7D7D7',
            borderBottomWidth: 1}}>
                <Image
                    source={{uri: rowData.actor.avatar_url}}
                    style={{
                        width: 36,
                        height: 36,
                        borderRadius: 18
                    }}
                />

                <View style={{paddingLeft: 20}}>
                    <Text style={{backgroundColor: '#FFF'}}>
                        {moment(rowData.created_at).fromNow()}
                    </Text>
                    <Text style={{backgroundColor: '#FFF'}}>
                        {rowData.actor.login} pushed to
                    </Text>
                    <Text style={{backgroundColor: '#FFF'}}>
                        {rowData.payload.ref.replace('refs/head/', '')}
                    </Text>
                    <Text style={{backgroundColor: '#FFF'}}>
                        at <Text style={{fontWeight: '600'}}>{rowData.repo.name}</Text>
                    </Text>
                </View>
            </View>
        );
    }

    render() {
        if (this.state.showProgress) {
            return <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                <ActivityIndicatorIOS
                    size="large"
                    animated={true}/>
            </View>
        }

        return (
            <View style={{
                flex: 1,
                justifyContent: 'flex-start'
            }}>
                <ListView
                    dataSource={this.state.dataSource}
                    renderRow={this.renderRow.bind(this)}/>
            </View>
        );
    }
}

module.exports = Feed;