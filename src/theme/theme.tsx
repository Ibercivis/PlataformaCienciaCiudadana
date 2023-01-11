import {StyleSheet} from 'react-native';
import {Colors} from './colors'

export const globalStyles = StyleSheet.create({
  globalMargin: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  globalText: {
    color: 'black'
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 100,
    backgroundColor: 'red',
  },
  drawerItems: {
    marginVertical: 30,
    marginHorizontal: 30,
    alignContent: 'flex-start',
  },
  menuButton: {
    marginVertical: 10,
    marginTop: 10,
  },
  menuText: {
    fontSize: 20,
    color: Colors.primary,
    marginLeft: 10,
  },
  icons: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 1,
    backgroundColor: 'transparent'
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    height: 600,
    marginBottom: 50,
  },
  title: {
    color: '#5C95FF',
    fontSize: 30,
    fontWeight: 'bold',
    marginTop: 10,
  },
  label: {
    color: '#5C95FF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  inputField: {
    color: '#5C95FF',
    fontSize: 20,
  },
  inputFieldIOS: {
    borderBottomColor: '#5C95FF',
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    borderWidth: 2,
    borderColor: '#5C95FF',
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderRadius: 100,
  },
  buttonText: {
    fontSize: 18,
    color: '#5C95FF',
  },
  newUserContainer: {
    alignItems: 'flex-end',
    marginTop: 20,
  },
  buttonReturn: {
    position: 'absolute',
    top: 50,
    right: 20,
    borderWidth: 1,
    borderColor: '#5C95FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
  },
});
