import color from 'color';
import React, {Component} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  TextInput as RNTextInput,
} from 'react-native';
import {
  Appbar,
  Divider,
  List,
  Text,
  DefaultTheme,
  Snackbar,
  TextInput,
} from 'react-native-paper';
import AppService from '../service/AppService';
import Student from '../domain/Student';
import type {Students} from '../domain/Student';
import type {NavigationStackProp} from 'react-navigation-stack';
import type {NavigationEventSubscription} from 'react-navigation';

type State = {
  data: Students;
  showToast: boolean;
  info: string;
  search: string;
};
type Props = {
  navigation: NavigationStackProp;
};
export default class Home extends Component<Props, State> {
  _sub!: NavigationEventSubscription;
  _search: null | undefined | React.ElementRef<typeof RNTextInput>;
  constructor(props: Props) {
    super(props);
    this.state = {
      data: [],
      showToast: false,
      info: '',
      search: '',
    };
  }

  async componentDidMount() {
    this._sub = this.props.navigation.addListener(
      'willFocus',
      this._loadStudents.bind(this),
    );
  }

  componentWillUnmount() {
    this._sub.remove();
  }

  async _loadStudents() {
    try {
      let students = await AppService.studentService.findAllStudents(
        this.state.search,
      );
      let showToast = false;
      let info = '';
      if (students.length === 0) {
        showToast = true;
        info = 'Data belum ada';
      }
      this.setState({data: students, showToast, info});
    } catch (error) {
      console.log('error ', error);
      this.setState({showToast: true, info: 'Something broke!'});
    }
  }

  _handleSearch() {
    this._loadStudents();
  }

  _handleCreate() {
    this.props.navigation.navigate('FormStudent');
  }

  _handleClickItem(item: Student) {
    this.props.navigation.navigate('DetailStudent', {
      id: item.id,
      title: item.fullName,
    });
  }

  render() {
    const {data, showToast, info, search} = this.state;
    return (
      <>
        <Snackbar
          visible={showToast}
          duration={Snackbar.DURATION_SHORT}
          onDismiss={() => this.setState({showToast: false, info: ''})}>
          {info}
        </Snackbar>
        <FlatList
          ListHeaderComponent={
            <>
              <Appbar>
                <Appbar.Content title="Sekolahku" />
                <Appbar.Action
                  icon="magnify"
                  onPress={() =>
                    this._search && this._search.focus && this._search.focus()
                  }
                />
                <Appbar.Action
                  icon="plus"
                  onPress={this._handleCreate.bind(this)}
                />
              </Appbar>
              <TextInput
                ref={(ref) => (this._search = ref)}
                autoCapitalize="none"
                label="Cari..."
                value={search}
                onChangeText={(text) => this.setState({search: text})}
                onSubmitEditing={() => this._handleSearch()}
              />
            </>
          }
          data={data}
          renderItem={({item}) => (
            <List.Item
              title={item.fullName}
              description={item.gender}
              left={(props) => <List.Icon {...props} icon="account" />}
              right={(props) => {
                return (
                  <View style={[styles.itemColumn, props.style]}>
                    <Text style={styles.rightText}>
                      {item.grade.toUpperCase()}
                    </Text>
                    <Text style={[styles.subtitle, styles.rightText]}>
                      {item.mobilePhone}
                    </Text>
                  </View>
                );
              }}
              onPress={() => this._handleClickItem(item)}
            />
          )}
          keyExtractor={(item) => item.id.toString()}
          ItemSeparatorComponent={() => <Divider />}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  itemColumn: {
    // flex: 0.5,
    flexDirection: 'column',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
  },
  subtitle: {
    fontSize: 12,
  },
  rightText: {
    color: color(DefaultTheme.colors.text).alpha(0.54).rgb().string(),
  },
});
