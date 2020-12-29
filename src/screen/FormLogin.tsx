import * as React from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Image,
  TextInput as RNTextInput,
} from 'react-native';
import {TextInput, Button, HelperText, Snackbar} from 'react-native-paper';
import {Images} from '../asset';
import type {NavigationStackProp} from 'react-navigation-stack';

type Props = {
  navigation: NavigationStackProp;
};
type Fields = {
  username: string;
  password: string;
};
type FieldNames = keyof Fields;
type State = Fields & {
  errorMessages: Map<string, string>;
  showToast: boolean;
  loading: boolean;
};
export default class FormLogin extends React.Component<Props, State> {
  _password: undefined | null | React.ElementRef<typeof RNTextInput>;

  constructor(props: Props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      errorMessages: new Map<string, string>(),
      showToast: false,
      loading: false,
    };
  }

  _submit() {
    this.setState(
      (prevState) => {
        let errorMessages = new Map<string, string>();
        const {username, password} = prevState;
        if (!username) {
          errorMessages.set('username', 'Username is required');
        }
        if (!password) {
          errorMessages.set('password', 'Password is required');
        }
        return {...prevState, errorMessages, loading: true};
      },
      () => {
        if (
          this.state.username === 'admin' &&
          this.state.password === 'admin'
        ) {
          this.props.navigation.navigate('Home');
        } else {
          this.setState({showToast: true, loading: false});
        }
      },
    );
  }

  _isUsernameValid() {
    return /^[a-zA-Z]*$/.test(this.state.username);
  }

  _onChangeField(field: FieldNames, text: string) {
    this.setState((prevState) => {
      const cloneErrorMessages = new Map<string, string>(
        prevState.errorMessages,
      );
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
    const {username, password, errorMessages, showToast, loading} = this.state;
    return (
      <>
        <Snackbar
          visible={showToast}
          duration={Snackbar.DURATION_SHORT}
          onDismiss={() => this.setState({showToast: false})}>
          Username dan password-nya "admin"
        </Snackbar>
        <Image source={Images.sekolah} style={styles.avatar} />
        <KeyboardAvoidingView
          style={styles.container}
          keyboardVerticalOffset={80}>
          <TextInput
            autoCapitalize="none"
            returnKeyType="next"
            mode="outlined"
            label="Username"
            value={username}
            onChangeText={(text) => this._onChangeField('username', text)}
            onSubmitEditing={() =>
              this._password && this._password.focus && this._password.focus()
            }
          />
          <HelperText
            type="error"
            visible={errorMessages.has('username') || !this._isUsernameValid()}>
            Error:{' '}
            {errorMessages.has('username')
              ? errorMessages.get('username')
              : 'Only letters are allowed'}
          </HelperText>
          <TextInput
            ref={(ref: null | React.ElementRef<typeof RNTextInput>) =>
              (this._password = ref)
            }
            secureTextEntry
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={(text) => this._onChangeField('password', text)}
            onSubmitEditing={() => this._submit()}
          />
          <HelperText type="error" visible={errorMessages.has('password')}>
            Error: {errorMessages.get('password')}
          </HelperText>
          <Button
            loading={loading}
            style={styles.button}
            icon="send"
            mode="contained"
            onPress={this._submit.bind(this)}>
            Login
          </Button>
        </KeyboardAvoidingView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 8,
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  button: {
    marginTop: 8,
  },
  avatar: {
    alignSelf: 'center',
    width: 150,
    height: 150,
    marginVertical: 20,
  },
});
