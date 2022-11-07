import {StyleSheet} from 'react-native';

export const globalStyles = StyleSheet.create({
  globalMargin: {
    marginHorizontal: 20,
    marginTop: 20,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  avatar: {
    width: 150,
    height: 150,
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
    color: 'black',
  },
  icons: {
    justifyContent: 'center',
    alignItems: 'center',
    top: 1,
  },
});
