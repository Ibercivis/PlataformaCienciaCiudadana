import React, {useState} from 'react';
import {View, StyleSheet, Image, ImageBackground} from 'react-native';
import {IconBootstrap} from './IconBootstrap';
import {Text} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RFPercentage} from 'react-native-responsive-fontsize';
import People from '../../assets/icons/general/people.svg';
import Heart from '../../assets/icons/general/heart.svg';
import HeartFill from '../../assets/icons/general/heart-fill.svg';
import Plus from '../../assets/icons/general/plus-lg.svg';
import {FontSize} from '../../theme/fonts';
import { Colors } from '../../theme/colors';

const categoryIcons = [
  require('../../assets/icons/category/Group-1.png'),
  require('../../assets/icons/category/Group-2.png'),
  require('../../assets/icons/category/Group-3.png'),
  require('../../assets/icons/category/Group-4.png'),
  require('../../assets/icons/category/Group-5.png'),
  require('../../assets/icons/category/Group-6.png'),
  require('../../assets/icons/category/Group-7.png'),
  require('../../assets/icons/category/Group-8.png'),
  require('../../assets/icons/category/Group.png'),
  require('../../assets/icons/category/Group-1.png'),
  require('../../assets/icons/category/Group-1.png'),
];

interface Props {
  type?: string;
  categoryImage?: number;
  onPress?: () => void;
  title?: string;
  boolHelper?: boolean;
}
export const Card = ({
  type,
  categoryImage = 0,
  onPress,
  title = 'prueba',
  boolHelper = false,
}: Props) => {
  const [pressed, setPressed] = useState(false);
  const [heart, setHeart] = useState(false);

  const onChangeCategoryPressed = () => {
    setPressed(!pressed)
  }

  const cardType = () => {
    switch (type) {
      case 'category':
        return (
          <>
          {/* el primero es si está presionado, el segundo si no */}
            {boolHelper ? (
              <TouchableOpacity style={style.categoryPressed} onPress={onChangeCategoryPressed}>
                <View>
                  {/* <IconBootstrap name="eye" size={99} color="black" /> */}
                  <View
                    style={{
                      height: '75%',
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      padding: '30%',
                      // backgroundColor: 'blue',
                    }}>
                    <Image
                      style={{alignSelf: 'center'}}
                      source={categoryIcons[categoryImage]}
                    />
                  </View>
                  <View
                    style={{
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      height: '22%',
                      flexDirection: 'row',
                      marginHorizontal: '2%',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        alignSelf: 'center',
                        flexWrap: 'wrap',
                        fontSize: FontSize.fontSizeText10,
                      }}>
                      {title}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={style.category} onPress={onChangeCategoryPressed}>
                <View>
                  {/* <IconBootstrap name="eye" size={99} color="black" /> */}
                  <View
                    style={{
                      height: '75%',
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      padding: '30%',
                      // backgroundColor: 'blue',
                    }}>
                    <Image
                      style={{alignSelf: 'center'}}
                      source={categoryIcons[categoryImage]}
                    />
                  </View>
                  <View
                    style={{
                      alignContent: 'center',
                      alignItems: 'center',
                      alignSelf: 'center',
                      height: '22%',
                      flexDirection: 'row',
                      marginHorizontal: '2%',
                    }}>
                    <Text
                      style={{
                        textAlign: 'center',
                        textAlignVertical: 'center',
                        alignSelf: 'center',
                        flexWrap: 'wrap',
                        fontSize: FontSize.fontSizeText10,
                      }}>
                      {title}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </>
        );
      case 'categoryPlus':
        return (
          <TouchableOpacity style={style.category} onPress={onPress}>
            <View style={{alignItems: 'center'}}>
              {/* <IconBootstrap name="eye" size={99} color="black" /> */}
              <View
                style={{
                  height: '75%',
                  alignSelf: 'center',
                  padding: '30%',
                  backgroundColor: 'transparent',
                }}>
                <Plus height={40} width={40} />
              </View>
              <Text
                style={{
                  marginBottom: '5%',
                  marginLeft: '10%',
                  marginRight: '5%',
                }}>
                Más...
              </Text>
            </View>
          </TouchableOpacity>
        );
      case 'newProjects':
        return (
          <TouchableOpacity style={style.newProject} onPress={onPress}>
            <View>
              <ImageBackground
                borderRadius={10}
                // source={require(urii)}
                source={require('../../assets/backgrounds/login-background.jpg')}
                style={[style.imageBackground]}>
                <View style={{alignItems: 'stretch', flex: 1}}>
                  <Text
                    style={{
                      // textAlign: 'center',
                      marginBottom: '5%',
                      marginLeft: '10%',
                      marginRight: '10%',
                      marginTop: RFPercentage(4),
                      backgroundColor: 'white',
                      alignSelf: 'flex-start',
                    }}>
                    {title}
                  </Text>
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        );
      case 'newProjectsPlus':
        return (
          <TouchableOpacity style={style.newProject} onPress={onPress}>
            <View style={{alignItems: 'center'}}>
              <View style={{alignItems: 'center'}}>
                <View
                  style={{
                    marginTop: 18,
                    // backgroundColor: 'cyan',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '30%',
                    height: '50%',
                  }}>
                  <IconBootstrap name={'plus'} size={20} color={'black'} />
                </View>
                <Text
                  style={{
                    // textAlign: 'center',
                    marginBottom: '5%',
                    marginLeft: '10%',
                    marginRight: '5%',
                  }}>
                  Más...
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      case 'importants':
        return (
          <TouchableOpacity style={style.importants} onPress={onPress}>
            <View>
              <ImageBackground
                borderTopLeftRadius={10}
                borderTopRightRadius={10}
                source={require('../../assets/backgrounds/login-background.jpg')}
                style={[style.imageBackgroundImportants]}></ImageBackground>
              <View
                style={{marginHorizontal: 14, marginTop: 13, marginBottom: 6}}>
                <Text
                  style={{
                    // backgroundColor: 'white',
                    marginBottom: 9,
                    alignSelf: 'flex-start',
                  }}>
                  Project Name
                </Text>
                <Text
                  style={{
                    // backgroundColor: 'white',
                    alignSelf: 'flex-start',
                    color: 'blue',
                  }}>
                  adsasdaasdasdasdasadasdas
                </Text>
                <View
                  style={{
                    marginTop: '15%',
                    flexDirection: 'row',
                    alignContent: 'center',
                    // justifyContent: 'space-between',
                    // backgroundColor:'red'
                  }}>
                  {/* <IconBootstrap name={'plus'} size={20} color={'black'} /> */}
                  <People width={16} height={16} color={'#000000'} />
                  <Text
                    style={{
                      fontSize: FontSize.fontSizeText13,
                      marginHorizontal: RFPercentage(1),
                    }}>
                    1500
                  </Text>
                  {/* <IconBootstrap name={'plus'} size={20} color={'black'} /> */}
                  {boolHelper ? (
                    <HeartFill width={16} height={16} color={'#ff0000'} />
                  ) : (
                    <Heart width={16} height={16} color={'#000000'} />
                  )}
                  <Text
                    style={{
                      fontSize: FontSize.fontSizeText13,
                      marginHorizontal: RFPercentage(1),
                    }}>
                    120
                  </Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      case 'importantsPlus':
        return (
          <TouchableOpacity style={style.importants} onPress={onPress}>
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  height: '75%',
                  alignSelf: 'center',
                  padding: '30%',
                  backgroundColor: 'transparent',
                }}>
                <Plus height={60} width={60} />
              </View>
              <View
                style={{marginHorizontal: 14, marginBottom: RFPercentage(2)}}>
                <Text
                  style={{
                    marginBottom: RFPercentage(3.1),
                    // marginLeft: '10%',
                    // marginRight: '5%',
                  }}>
                  Más...
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      case 'interesting':
        return (
          <TouchableOpacity style={style.interesting} onPress={onPress}>
            <View>
              <ImageBackground
                borderRadius={10}
                // source={require(urii)}
                source={require('../../assets/backgrounds/login-background.jpg')}
                style={[style.imageBackground]}>
                <View style={{alignItems: 'stretch', flex: 1}}>
                  <Text
                    style={{
                      // textAlign: 'center',
                      marginBottom: '5%',
                      marginLeft: '10%',
                      marginRight: '10%',
                      marginTop: RFPercentage(8),
                      backgroundColor: 'white',
                      alignSelf: 'flex-start',
                    }}>
                    project name
                  </Text>
                  <Text
                    style={{
                      // textAlign: 'center',
                      marginBottom: '5%',
                      marginLeft: '10%',
                      marginRight: '10%',
                      //   marginTop: 50,
                      backgroundColor: 'blue',
                      alignSelf: 'flex-start',
                      color: 'white',
                    }}>
                    mas texto
                  </Text>
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        );
      case 'interestingPlus':
        return (
          <TouchableOpacity style={style.interesting} onPress={onPress}>
            <View style={{alignItems: 'center'}}>
              <View
                style={{
                  height: '75%',
                  alignSelf: 'center',
                  padding: '30%',
                  backgroundColor: 'transparent',
                }}>
                <Plus height={60} width={60} />
              </View>
              <View
                style={{marginHorizontal: 14, marginBottom: RFPercentage(2)}}>
                <Text
                  style={{
                    marginBottom: RFPercentage(3.1),
                  }}>
                  Más...
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      case 'organization':
        return (
          <TouchableOpacity
            activeOpacity={0.5}
            style={style.touchableOrganization}
            onPress={onPress}>
            <View style={style.organization}>
              <ImageBackground
                borderRadius={100}
                // source={require(urii)}
                source={require('../../assets/backgrounds/login-background.jpg')}
                style={[style.imageBackgroundOrganization]}></ImageBackground>
              <View style={{alignItems: 'stretch'}}>
                <Text
                  style={{
                    // textAlign: 'center',
                    marginBottom: '7%',
                    marginLeft: '10%',
                    marginRight: '10%',
                    marginTop: '5%',
                    //   backgroundColor: 'red',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  organization name
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      case 'organizationPlus':
        return (
          <TouchableOpacity
            activeOpacity={0.5}
            style={style.touchableOrganization}
            onPress={onPress}>
            <View>
              <View
                style={{
                  ...style.imageBackgroundOrganization,
                  //   shadowColor: '#000',
                  //   shadowOffset: {
                  //     width: 0,
                  //     height: 0.1,
                  //   },
                  //   shadowOpacity: 0.2,
                  //   shadowRadius: 1.41,
                  //   elevation: 1,
                }}>
                <Plus
                  style={{alignSelf: 'center', bottom: RFPercentage(2)}}
                  height={60}
                  width={60}
                />
              </View>
              <View style={{alignItems: 'stretch'}}>
                <Text
                  style={{
                    // textAlign: 'center',
                    marginBottom: '7%',
                    marginLeft: '10%',
                    marginRight: '10%',
                    marginTop: '5%',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  Más...
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      case 'projectFound':
        return (
          <TouchableOpacity
            activeOpacity={0.5}
            style={style.projectFound}
            onPress={onPress}>
            <View>
              <View>
                <View
                  style={{
                    // marginHorizontal: 14,
                    marginTop: 13,
                    marginBottom: 6,
                  }}>
                  <Text
                    style={{
                      // backgroundColor: 'white',
                      marginBottom: '1%',
                      alignSelf: 'flex-start',
                    }}>
                    Project Name
                  </Text>
                  <Text
                    style={{
                      // backgroundColor: 'white',
                      alignSelf: 'flex-start',
                      color: 'blue',
                      marginBottom: '4%',
                    }}>
                    organization
                  </Text>
                  <Text
                    style={{
                      // backgroundColor: 'white',
                      alignSelf: 'flex-start',
                      marginBottom: '4%',
                    }}>
                    MUCHO textoMUCHO textoMUCHO textoMUCHO textoMUCHO textoMUCHO
                    textoMUCHO textoMUCHO textoMUCHO textoMUCHO textoMUCHO
                    textoMUCHO textoMUCHO textoMUCHO textoMUCHO textoMUCHO
                    textoMUCHO textoMUCHO textoMUCHO textoMUCHO textoMUCHO texto
                  </Text>
                </View>
              </View>
              <ImageBackground
                // borderRadius={10}
                // source={require(urii)}
                source={require('../../assets/backgrounds/login-background.jpg')}
                style={{
                  ...style.imageBackground,
                  width: '100%',
                  height: 200,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginHorizontal: RFPercentage(1),
                    // backgroundColor: 'red',
                    top: RFPercentage(16),
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: 'white',
                      borderRadius: 15,
                      margin: '2%',
                      paddingHorizontal: '3%',
                      paddingVertical: '2%',
                    }}>
                    <People width={16} height={16} color={'#000000'} />
                    <Text
                      style={{
                        fontSize: FontSize.fontSizeText13,
                        marginHorizontal: RFPercentage(1),
                      }}>
                      1500
                    </Text>
                    {/* <IconBootstrap name={'plus'} size={20} color={'black'} /> */}
                    {boolHelper ? (
                      <HeartFill width={16} height={16} color={'#ff0000'} />
                    ) : (
                      <Heart width={16} height={16} color={'#000000'} />
                    )}
                    <Text
                      style={{
                        fontSize: FontSize.fontSizeText13,
                        marginHorizontal: RFPercentage(1),
                      }}>
                      120
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      backgroundColor: 'white',
                      borderRadius: 15,
                      margin: '2%',
                      paddingHorizontal: '3%',
                      paddingVertical: '2%',
                    }}>
                    <Text
                      style={{
                        fontSize: FontSize.fontSizeText13,
                        marginHorizontal: RFPercentage(1),
                      }}>
                      120
                    </Text>
                    <Heart width={16} height={16} color={'#000000'} />
                  </View>
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        );

      default:
        return <h1>No project match</h1>;
    }
  };

  return (
    <>
      <View>{cardType()}</View>
    </>
  );
};

const style = StyleSheet.create({
  container: {},
  category: {
    height: RFPercentage(13),
    width: 90,
    marginHorizontal: 4,
    marginVertical: 4,
    backgroundColor: 'white',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  categoryPressed: {
    height: RFPercentage(13),
    width: 90,
    marginHorizontal: 4,
    marginVertical: 4,
    backgroundColor: Colors.backgrounSecondaryDark,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  newProject: {
    height: 90,
    width: 150,
    margin: 4,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  imageBackground: {
    height: '100%',
    borderRadius: 10,
  },
  importants: {
    // height: '100%',
    width: 185,
    margin: 4,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4.41,
    elevation: 2,
  },
  imageBackgroundImportants: {
    height: 150,
    borderRadius: 10,
  },

  interesting: {
    height: '90%',
    width: RFPercentage(18),
    margin: 4,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  imageBackgroundInteresting: {
    height: '100%',
    borderRadius: 10,
  },
  organization: {},
  imageBackgroundOrganization: {
    // height: '100%',
    // width:'100%',
    marginTop: RFPercentage(1),
    height: RFPercentage(12),
    width: RFPercentage(12),
    // borderRadius: 10,
    alignSelf: 'center',
    padding: '30%',
  },
  touchableOrganization: {
    height: '90%',
    width: RFPercentage(18),
    margin: 4,
    borderRadius: 10,
    backgroundColor: 'white',
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 0.1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,
    // elevation: 1,
  },
  projectFound: {
    // height: '100%',
    // width: '100%',
    margin: 4,
    borderRadius: 10,
    backgroundColor: 'white',
  },
});
