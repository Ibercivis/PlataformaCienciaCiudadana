import {StackScreenProps} from '@react-navigation/stack';
import React, {useEffect, useState} from 'react';
import {
  Animated,
  ImageBackground,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import {Project, User} from '../../../interfaces/interfaces';
import AsyncStorage from '@react-native-async-storage/async-storage';
import citmapApi from '../../../api/citmapApi';
import {HeaderComponent} from '../../HeaderComponent';
import {useForm} from '../../../hooks/useForm';
import {RFPercentage} from 'react-native-responsive-fontsize';
import Stars from 'react-native-bootstrap-icons/icons/stars';
import {FontWeight} from '../../../theme/fonts';

interface Props extends StackScreenProps<any, any> {}

export const Profile = ({navigation}: Props) => {
  //#region Variables
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {key: 'one', title: 'Contribution'},
    {key: 'two', title: 'Created'},
    {key: 'three', title: 'Liked'},
  ]);

  const [projectList, setProjectList] = useState<Project[]>([]);
  const [user, setUser] = useState<User>({
    pk: 0,
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });
  const {form, onChange, setObject} = useForm<User>(user);

  //#endregion

  //#region tabs
  const Contribution = () => (
    <View style={{flex: 1, backgroundColor: 'transparent'}} />
  );

  const Created = () => <View style={{flex: 1, backgroundColor: 'transparent'}} />;

  const Liked = () => <View style={{flex: 1, backgroundColor: 'transparent'}} />;

  const renderScene = SceneMap({
    one: Contribution,
    two: Created,
    three: Liked,
  });

  const _renderTabBar = (props: {
    navigationState: {routes: any[]};
    position: {interpolate: (arg0: {inputRange: any; outputRange: any}) => any};
  }) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);

    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map(inputIndex =>
              inputIndex === i ? 1 : 0.5,
            ),
          });
          const fontWeight = i ? 'bold' : '500';

          return (
            <TouchableOpacity
              style={styles.tabItem}
              onPress={() => setIndex(i)}>
              <Animated.Text style={{opacity, fontWeight, color: 'black'}}>
                {route.title}
              </Animated.Text>
              <View
                style={[
                  styles.tabBarIndicator,
                  {backgroundColor: i === index ? '#304be2' : 'transparent'},
                ]}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  //#endregion

  //#region useEffects
  useEffect(() => {
    userDataApi();
    projectListApi(); //este habrá que moverlo a dentro del userDataApi para que cargue en el futuro los proyectos que el tiene favs y demás
  }, []);

  useEffect(() => {
    setObject(user);
  }, [user]);
  //#endregion

  //#region api
  const projectListApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<Project[]>('/project/', {
        headers: {
          Authorization: token,
        },
      });
      setProjectList(resp.data);
    } catch {}
  };

  const userDataApi = async () => {
    const token = await AsyncStorage.getItem('token');
    try {
      const resp = await citmapApi.get<User>('/users/authentication/user/', {
        headers: {
          Authorization: token,
        },
      });
      setUser(resp.data);
    } catch {}
  };
  //#endregion

  //#region Methods
  const writeForm = () => {
    setObject(user);
  };
  //#endregion

  return (
    <>
      <HeaderComponent
        title={form.email}
        onPressLeft={() => navigation.goBack()}
        onPressRight={() => console.log('jaja')}
        rightIcon={false}
      />
      <ScrollView
        style={styles.scrollParent}
        nestedScrollEnabled={true}
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="handled">
        {/* contenedor profile */}
        <View style={styles.profileContainer}>
          {/* info de arriba */}
          <View
            style={{
              height: RFPercentage(14),
              flexDirection: 'row',
              marginTop: RFPercentage(3),
            }}>
            {/* foto de perfil */}
            <View
              style={{
                width: '30%',
                height: '100%',
                marginRight: RFPercentage(1),
              }}>
              <ImageBackground
                borderRadius={10}
                // source={require(urii)}
                source={require('../../../assets/backgrounds/login-background.jpg')}
                style={{height: '100%', borderRadius: 10}}></ImageBackground>
            </View>
            {/* datos derecha */}
            <View
              style={{
                width: '70%',
                height: '80%',
                flexDirection: 'column',
              }}>
              {/* contribuciones creados */}
              <View
                style={{
                  width: '100%',
                  flexDirection: 'column',
                  marginVertical: RFPercentage(1),
                }}>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}>
                  <View style={styles.viewDataProfile}>
                    <Text style={{fontWeight: 'bold', color: 'black'}}>
                      180
                    </Text>
                  </View>
                  <View style={styles.viewDataProfile}>
                    <Text style={{fontWeight: 'bold', color: 'black'}}>10</Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                    alignItems: 'center',
                    alignSelf: 'center',
                  }}>
                  <View style={styles.viewDataProfile}>
                    <Text>contribuciones</Text>
                  </View>
                  <View style={styles.viewDataProfile}>
                    <Text>creados</Text>
                  </View>
                </View>
              </View>
              {/* organizacion country name */}
              <View
                style={{
                  width: '100%',
                  flexDirection: 'column',
                  marginVertical: RFPercentage(1.5),
                }}>
                <View
                  style={{
                    width: '100%',
                    marginHorizontal: RFPercentage(3),
                    marginVertical: RFPercentage(1),
                    flexDirection: 'row',
                  }}>
                  <Stars
                    width={RFPercentage(1.8)}
                    height={RFPercentage(1.8)}
                    fill={'#3a53e2'}
                  />
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'black',
                      alignSelf: 'center',
                      marginLeft: RFPercentage(0.5),
                      bottom: RFPercentage(0.1),
                    }}>
                    Organization.name
                  </Text>
                </View>
                <View
                  style={{
                    width: '100%',
                    marginHorizontal: RFPercentage(3),
                    flexDirection: 'row',
                  }}>
                  <Stars
                    width={RFPercentage(1.8)}
                    height={RFPercentage(1.8)}
                    fill={'#3a53e2'}
                  />
                  <Text
                    style={{
                      fontWeight: 'bold',
                      color: 'black',
                      alignSelf: 'center',
                      marginLeft: RFPercentage(0.5),
                      bottom: RFPercentage(0.1),
                    }}>
                    Country.city
                  </Text>
                </View>
              </View>
            </View>
          </View>
          {/* info de abajo */}
          <View
            style={{
            //   height: '60%',
            flex:1,
              marginVertical: RFPercentage(2),
            }}>
            <Text style={{fontWeight: 'normal', color: 'black'}}>
            
            Alguna descriocionAlguna descriocionAlguna descriocion
            Alguna descriocionAlguna descriocionAlguna descriocion
            Alguna descriocionAlguna descriocionAlguna descriocion
            Alguna descriocionAlguna descriocionAlguna descriocion
            Alguna descriocionAlguna descriocionAlguna descriocion
            Alguna descriocionAlguna descriocionAlguna descriocion
            Alguna descriocionAlguna descriocionAlguna descriocion
            Alguna descriocionAlguna descriocionAlguna descriocion
            </Text>
          </View>
        </View>
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          renderTabBar={_renderTabBar}
          style={{flex:1}}
          //   initialLayout={{width: RFPercentage(20)}}
        />
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  scrollParent: {
    flexGrow: 1,
  },
  profileContainer: {
    // height: RFPercentage(34),
    marginHorizontal: RFPercentage(3),
    // backgroundColor:'yellow'
  },
  viewDataProfile: {
    width: '50%',
    alignItems: 'center',
    alignSelf: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    // paddingTop: StatusBar.currentHeight,
    // marginTop: RFPercentage(2),
    marginHorizontal: RFPercentage(2)
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    padding: RFPercentage(2),
  },
  tabBarIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 4,
  },
});
