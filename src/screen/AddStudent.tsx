import React, {Component} from 'react';
import {StyleSheet, View, Dimensions} from 'react-native';
import {Appbar, List, TextInput, RadioButton, Text} from 'react-native-paper';
import AppService from '../service/AppService';
import Student from '../domain/Student';
import {getTypeDatas} from '../seed/seedStudent';
import {Picker} from '@react-native-picker/picker';

type State = {
  data: Student;
  text: '';
  setText: '';
  checked: String;
  language: String;
};
type Props = {};

export default class AddStudent extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    let student = AppService.studentService.findStudentById(1);
    this.state = {
      data: student,
      text: '',
      setText: '',
      checked: 'pria',
      language: 'java',
    };
  }

  async componentDidMount() {}

  _handleSave() {
    console.log('save here');
  }

  _handleClickItem(item: Student) {
    console.log('navigation here');
  }

  _handleBack() {
    console.log('back here');
  }

  render() {
    const {data, text, setText, checked, language} = this.state;
    console.log(data);
    // const {typeGender} = getTypeDatas('gender');
    console.log(getTypeDatas('gender'));
    return (
      <>
        {console.log('')}
        <Appbar>
          <Appbar.Action
            icon="arrow-left"
            onPress={this._handleBack.bind(this)}
          />
          <Appbar.Content title="Tambah Siswa" />
          <Appbar.Action
            icon="content-save"
            onPress={this._handleSave.bind(this)}
          />
        </Appbar>
        <View
          style={{
            flexDirection: 'column',
            width: Dimensions.get('window').width,
          }}>
          <View
            style={{
              flexDirection: 'row',
              padding: 15,
              justifyContent: 'space-between',
            }}>
            <TextInput
              style={{
                width: (Dimensions.get('window').width - 40) / 2,
              }}
              label="Nama Depan"
              value={text}
              onChangeText={(text) => setText(text)}
            />
            <TextInput
              style={{
                width: (Dimensions.get('window').width - 40) / 2,
              }}
              label="Nama Belakang"
              value={text}
              onChangeText={(text) => setText(text)}
            />
          </View>
          <View
            style={{
              padding: 15,
              width: Dimensions.get('window').width,
            }}>
            <TextInput
              label="No. Hp"
              value={text}
              onChangeText={(text) => setText(text)}
            />
          </View>
          <Text
            style={{
              paddingLeft: 15,
              color: 'purple',
            }}>
            Gender
          </Text>
          <View
            style={{
              flexDirection: 'row',
              padding: 15,
              alignItems: 'center',
            }}>
            {getTypeDatas('gender').map((gender) => (
              <View
                style={{
                  flexDirection: 'row',
                  paddingRight: 20,
                  alignItems: 'center',
                }}>
                {console.log('ini gender ' + gender)}
                {console.log('ini checked ' + checked)}
                <RadioButton
                  value={gender}
                  status={checked === gender ? 'checked' : 'unchecked'}
                  onPress={() => {
                    this.setState({checked: gender});
                  }}
                />
                <Text>{gender}</Text>
              </View>
            ))}
          </View>
        </View>
        <Picker
          selectedValue={this.state.language}
          style={{height: 50, width: 100}}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({language: itemValue})
          }>
          <Picker.Item label="Java" value="java" />
          <Picker.Item label="JavaScript" value="js" />
        </Picker>
        <List.Item
          title={data.grade}
          description="Jenjang"
          left={(props) => <List.Icon {...props} icon="account" />}
        />
        <List.Item
          title={data.address}
          description="Alamat"
          left={(props) => <List.Icon {...props} icon="account" />}
        />
        <List.Item
          title={data.hobbies.join(',')}
          description="Hobi"
          left={(props) => <List.Icon {...props} icon="account" />}
        />
      </>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
    alignSelf: 'center',
    marginVertical: 8,
  },
});
