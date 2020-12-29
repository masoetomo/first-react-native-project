import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Keyboard,
  LayoutAnimation,
  Platform,
  EmitterSubscription,
  KeyboardEvent,
  TextInput as RNTextInput,
} from 'react-native';
import {
  Appbar,
  TextInput,
  RadioButton,
  TouchableRipple,
  Checkbox,
  Paragraph,
  HelperText,
  Snackbar,
} from 'react-native-paper';
import FormLabel from '../component/FormLabel';
import capitalize from '../util/capitalize';
import Student, {GenderType} from '../domain/Student';
import AppService from '../service/AppService';
import {Picker} from '@react-native-picker/picker';
import type {NavigationStackProp} from 'react-navigation-stack';

const translate = {
  firstName: 'Nama Depan',
  lastName: 'Nama Belakang',
  gender: 'Gender',
  grade: 'Jenjang',
  mobilePhone: 'No. Hp',
  address: 'Alamat',
};

type Messages = keyof typeof translate;

type FormField = {
  firstName: string;
  lastName: string;
  gender: GenderType;
  grade: string;
  mobilePhone: string;
  address: string;
  hobbies: Array<string>;
};

type FieldNames = Exclude<keyof FormField, 'hobbies'>;

type EditingField = FormField & {
  id: number;
  isEdit: boolean;
};

type State = EditingField & {
  keyboadOffset: number;
  errorMessages: Map<string, string>;
  showToast: boolean;
  info: string;
};
type Props = {
  navigation: NavigationStackProp<{}>;
};
export default class FormStudent extends PureComponent<Props, State> {
  _genders: string[];
  _grades: string[];
  _hobbies: string[];
  _keyboardDidShowListener!: EmitterSubscription;
  _keyboardDidHideListener!: EmitterSubscription;
  _lastName: null | undefined | React.ElementRef<typeof RNTextInput>;
  _mobilePhone: null | undefined | React.ElementRef<typeof RNTextInput>;

  constructor(props: Props) {
    super(props);
    this.state = {
      id: this.props.navigation.getParam('id', ''),
      firstName: this.props.navigation.getParam('firstName', ''),
      lastName: this.props.navigation.getParam('lastName', ''),
      gender: this.props.navigation.getParam('gender', 'pria'),
      grade: this.props.navigation.getParam('grade', 'tk'),
      mobilePhone: this.props.navigation.getParam('mobilePhone', ''),
      address: this.props.navigation.getParam('address', ''),
      hobbies: this.props.navigation.getParam('hobbies', []),
      isEdit: this.props.navigation.getParam('isEdit', false),
      keyboadOffset: 0,
      errorMessages: new Map(),
      showToast: false,
      info: '',
    };
    this._genders = ['pria', 'wanita'];
    this._grades = ['tk', 'sd', 'smp', 'sma'];
    this._hobbies = ['membaca', 'menulis', 'menggambar'];
  }

  componentDidMount() {
    // Using keyboardWillShow/Hide looks 1,000 times better, but doesn't work on Android
    // TODO: Revisit this if Android begins to support - https://github.com/facebook/react-native/issues/3468
    this._keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this._keyboardDidShow.bind(this),
    );
    this._keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this._keyboardDidHide.bind(this),
    );
  }

  componentWillUnmount() {
    this._keyboardDidShowListener.remove();
    this._keyboardDidHideListener.remove();
  }

  _keyboardDidShow(event: KeyboardEvent) {
    this.setState({keyboadOffset: event.endCoordinates.height});
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // alert('Keyboard Shown');
  }

  _keyboardDidHide(event: KeyboardEvent) {
    this.setState({keyboadOffset: event.endCoordinates.height});
    // Animation types easeInEaseOut/linear/spring
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    // alert('Keyboard Hidden');
  }

  _save() {
    this.setState(
      (prevState) => {
        let errorMessages = new Map<string, string>();
        const {
          firstName,
          lastName,
          gender,
          grade,
          mobilePhone,
          address,
          hobbies,
        } = prevState;
        let fields = {
          firstName,
          lastName,
          gender,
          grade,
          mobilePhone,
          address,
        };

        for (const key in fields) {
          if (fields.hasOwnProperty(key)) {
            const field = fields[key as FieldNames];
            if (!field) {
              errorMessages.set(
                key,
                `${translate[key as Messages]} harus diisi`,
              );
            }
          }
        }

        if (hobbies.length === 0) {
          errorMessages.set('hobbies', 'Hobi harus diisi');
        }

        return {errorMessages};
      },
      async () => {
        const {
          firstName,
          lastName,
          gender,
          grade,
          mobilePhone,
          address,
          hobbies,
          errorMessages,
          isEdit,
          id,
        } = this.state;

        let student = new Student();
        student.firstName = firstName;
        student.lastName = lastName;
        student.gender = gender;
        student.grade = grade;
        student.mobilePhone = mobilePhone;
        student.hobbies = hobbies;
        student.address = address;
        try {
          if (errorMessages.size === 0) {
            console.log('valid!');
            if (isEdit) {
              await AppService.studentService.updateStudentById(id, student);
            } else {
              await AppService.studentService.createStudent(student);
            }
            this.props.navigation.goBack();
          } else {
            console.log('Form is not valid!');
            Keyboard.dismiss();
            this.setState({showToast: true, info: 'invalid input'});
          }
        } catch (error) {
          Keyboard.dismiss();
          this.setState({showToast: true, info: error.message});
        }
      },
    );
  }

  _onChangeField(field: FieldNames, text: any) {
    this.setState((prevState) => {
      const cloneErrorMessages = new Map(prevState.errorMessages);
      let newState = {
        ...prevState,
        [field]: text,
        errorMessages: cloneErrorMessages,
      };
      if (cloneErrorMessages.has(field)) {
        cloneErrorMessages.delete(field);
      }

      return newState;
    });
  }

  render() {
    const {
      firstName,
      lastName,
      gender,
      grade,
      mobilePhone,
      address,
      hobbies,
      keyboadOffset,
      errorMessages,
      showToast,
      info,
    } = this.state;
    // console.log(errorMessages);
    return (
      <>
        <Snackbar
          visible={showToast}
          duration={Snackbar.DURATION_SHORT}
          onDismiss={() => this.setState({showToast: false, info: ''})}>
          {info}
        </Snackbar>
        <Appbar>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content
            title={this.props.navigation.getParam<string>(
              'title',
              'Tambah Siswa',
            )}
          />
          <Appbar.Action icon="content-save" onPress={this._save.bind(this)} />
        </Appbar>
        <ScrollView style={styles.wrapper}>
          <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={keyboadOffset}
            enabled>
            <View style={styles.rowInput}>
              <View style={styles.column}>
                <TextInput
                  autoFocus={true}
                  style={styles.input}
                  returnKeyType="next"
                  mode="outlined"
                  label="Nama Depan"
                  value={firstName}
                  onChangeText={(text) =>
                    this._onChangeField('firstName', text)
                  }
                  onSubmitEditing={() =>
                    this._lastName &&
                    this._lastName.focus &&
                    this._lastName.focus()
                  }
                />
                <HelperText
                  type="error"
                  visible={errorMessages.has('firstName')}>
                  {errorMessages.get('firstName')}
                </HelperText>
              </View>
              <View style={styles.gap} />
              <View style={styles.column}>
                <TextInput
                  ref={(ref) => (this._lastName = ref)}
                  returnKeyType="next"
                  style={styles.input}
                  mode="outlined"
                  label="Nama Belakang"
                  value={lastName}
                  onChangeText={(text) => this._onChangeField('lastName', text)}
                  onSubmitEditing={() =>
                    this._mobilePhone &&
                    this._mobilePhone.focus &&
                    this._mobilePhone.focus()
                  }
                />
                <HelperText
                  type="error"
                  visible={errorMessages.has('lastName')}>
                  {errorMessages.get('lastName')}
                </HelperText>
              </View>
            </View>
            <TextInput
              ref={(ref) => (this._mobilePhone = ref)}
              keyboardType="phone-pad"
              mode="outlined"
              label="No. Hp"
              value={mobilePhone}
              onChangeText={(text) => this._onChangeField('mobilePhone', text)}
              onSubmitEditing={() => Keyboard.dismiss()}
            />
            <HelperText type="error" visible={errorMessages.has('mobilePhone')}>
              {errorMessages.get('mobilePhone')}
            </HelperText>
            <FormLabel>Gender</FormLabel>
            <RadioButton.Group
              onValueChange={(value) => this._onChangeField('gender', value)}
              value={gender}>
              <View style={styles.genderWrapper}>
                {this._genders.map((item, index) => (
                  <View key={index} style={styles.row}>
                    <RadioButton value={item} />
                    <Text>{capitalize(item)}</Text>
                  </View>
                ))}
              </View>
            </RadioButton.Group>
            <FormLabel>Jenjang</FormLabel>
            <Picker
              selectedValue={grade}
              onValueChange={(itemValue) =>
                this._onChangeField('grade', itemValue)
              }>
              {this._grades.map((item, index) => (
                <Picker.Item
                  key={index}
                  label={item.toUpperCase()}
                  value={item}
                />
              ))}
            </Picker>
            <FormLabel>Hobi</FormLabel>
            {this._hobbies.map((item, index) => (
              <TouchableRipple
                key={index}
                onPress={() =>
                  this.setState((prevState) => {
                    let newHobbies = [...prevState.hobbies];
                    if (prevState.hobbies.includes(item)) {
                      newHobbies.splice(newHobbies.indexOf(item), 1);
                    } else {
                      newHobbies.push(item);
                    }
                    const cloneErrorMessages = new Map(prevState.errorMessages);
                    let newState = {
                      hobbies: newHobbies,
                      errorMessages: cloneErrorMessages,
                    };
                    if (
                      newHobbies.length !== 0 &&
                      cloneErrorMessages.has('hobbies')
                    ) {
                      cloneErrorMessages.delete('hobbies');
                    }

                    return newState;
                  })
                }>
                <View>
                  <View pointerEvents="none" style={styles.row}>
                    <Checkbox
                      status={hobbies.includes(item) ? 'checked' : 'unchecked'}
                    />
                    <Paragraph>{capitalize(item)}</Paragraph>
                  </View>
                </View>
              </TouchableRipple>
            ))}
            <HelperText type="error" visible={errorMessages.has('hobbies')}>
              {errorMessages.get('hobbies')}
            </HelperText>
            <TextInput
              multiline
              textAlignVertical="top"
              numberOfLines={3}
              mode="outlined"
              label="Alamat"
              value={address}
              onChangeText={(text) => this._onChangeField('address', text)}
            />
            <HelperText type="error" visible={errorMessages.has('address')}>
              {errorMessages.get('address')}
            </HelperText>
            <View style={styles.bottom} />
          </KeyboardAvoidingView>
        </ScrollView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  wrapper: {
    flex: 1,
    padding: 8,
  },
  genderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
  },
  rowInput: {
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  gap: {
    paddingHorizontal: 5,
  },
  bottom: {
    paddingVertical: 12,
  },
  input: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingRight: 24,
  },
  column: {
    flex: 1,
    flexDirection: 'column',
  },
});
