import React, {Component} from 'react';
import {Image, StyleSheet} from 'react-native';
import {List, Appbar, Divider} from 'react-native-paper';
import AppService from '../service/AppService';
import Student from '../domain/Student';
import {Images} from '../asset';
import type {NavigationStackProp} from 'react-navigation-stack';
import type {NavigationEventSubscription} from 'react-navigation';

type Props = {
  navigation: NavigationStackProp<{id: string; title: string}>;
};
type State = {
  data: Student;
  avatar: {
    [key: string]: any;
  };
};
class DetailStudent extends Component<Props, State> {
  _sub!: NavigationEventSubscription;
  constructor(props: Props) {
    super(props);
    this.state = {
      data: new Student(),
      avatar: {
        pria: Images.pria,
        wanita: Images.wanita,
      },
    };
  }

  componentDidMount() {
    this._sub = this.props.navigation.addListener(
      'didFocus',
      this._loadData.bind(this),
    );
  }

  componentWillUnmount() {
    this._sub.remove();
  }

  async _loadData() {
    try {
      let id = this.props.navigation.getParam('id', 1);
      let data = await AppService.studentService.findStudentById(id);
      this.setState({data: Object.assign(new Student(), data)});
    } catch (error) {
      console.log(error);
    }
  }

  _handleEdit() {
    this.props.navigation.navigate('FormStudent', {
      isEdit: true,
      ...this.state.data.toJSON(),
    });
  }

  async _handleDelete() {
    try {
      let id = this.props.navigation.getParam('id', 1);
      await AppService.studentService.deleteStudentById(id);
      this.props.navigation.goBack();
    } catch (error) {
      console.log(error);
    }
  }

  render() {
    const {data, avatar} = this.state;
    // console.log('sd0s ', avatar);
    return (
      <>
        <Appbar>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title={data.fullName} />
          <Appbar.Action icon="pencil" onPress={() => this._handleEdit()} />
          <Appbar.Action icon="delete" onPress={() => this._handleDelete()} />
        </Appbar>
        <Image source={avatar[data.gender]} style={styles.avatar} />
        <List.Item
          title={data.fullName}
          left={(props) => <List.Icon {...props} icon="account-box-outline" />}
        />
        <Divider />
        <List.Item
          title={data.mobilePhone}
          left={(props) => <List.Icon {...props} icon="phone" />}
        />
        <Divider />
        <List.Item
          title={data.gender}
          left={(props) => <List.Icon {...props} icon="label" />}
        />
        <Divider />
        <List.Item
          title={data.grade}
          left={(props) => <List.Icon {...props} icon="stairs" />}
        />
        <Divider />
        <List.Item
          title={data.address}
          left={(props) => <List.Icon {...props} icon="map-marker" />}
        />
        <Divider />
        <List.Item
          title={data.hobbies.join(', ')}
          left={(props) => <List.Icon {...props} icon="heart" />}
        />
        <Divider />
      </>
    );
  }
}

export default DetailStudent;

const styles = StyleSheet.create({
  avatar: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    marginVertical: 20,
  },
});
