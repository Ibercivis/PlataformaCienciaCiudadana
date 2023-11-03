import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  ImageBackground,
  ViewStyle,
} from 'react-native';
import {IconBootstrap} from './IconBootstrap';
import {Text} from 'react-native-paper';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {RFPercentage} from 'react-native-responsive-fontsize';
import People from '../../assets/icons/general/people.svg';
import Heart from '../../assets/icons/general/heart.svg';
import HeartFill from '../../assets/icons/general/heart-fill.svg';
import Plus from '../../assets/icons/general/plus-lg.svg';
import {FontSize, FontWeight} from '../../theme/fonts';
import {Colors} from '../../theme/colors';
import {CustomButton} from './CustomButton';
import {SvgIcons} from './SvgIcons';
import {imageUrl} from '../../api/citmapApi';
import { heightPercentageToDP, widthPercentageToDP } from 'react-native-responsive-screen';

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
  onLike?: () => void;
  title?: string;
  description?: string;
  auxString?: string;
  totalLikes?: number;
  boolHelper?: boolean;
  styleProp?: ViewStyle;
  pressed?: boolean;
  cover?: string;
}
export const Card = ({
  type,
  categoryImage = 0,
  onPress,
  onLike,
  title = 'prueba',
  description = '',
  auxString = '',
  boolHelper = false,
  pressed = false,
  totalLikes = 0,
  cover,
  styleProp,
}: Props) => {
  const cardType = () => {
    switch (type) {
      case 'category':
        return (
          <>
            {/* el primero es si está presionado, el segundo si no */}
            <TouchableOpacity
              style={{
                ...style.category,
                backgroundColor: pressed
                  ? Colors.contentQuaternaryLight
                  : 'white',
              }}
              // onPressIn={onChangeCategoryPressed}
              onPress={onPress}>
              <View>
                {/* <IconBootstrap name="eye" size={99} color="black" /> */}
                <View
                  style={{
                    height: '70%',
                    alignContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    padding: '30%',
                  }}>
                  {/* <Image
                    style={{alignSelf: 'center'}}
                    source={categoryIcons[categoryImage]}
                  /> */}
                  <SvgIcons
                    id={categoryImage}
                    color={pressed ? '#fff' : '#000'}
                    size={RFPercentage(7)}
                  />
                </View>
                <View
                  style={{
                    alignContent: 'center',
                    alignItems: 'center',
                    alignSelf: 'center',
                    height: '26%',
                    flexDirection: 'row',
                    marginHorizontal: '2%',
                    marginBottom: '3%',
                  }}>
                  <Text
                    style={{
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      alignSelf: 'center',
                      flexWrap: 'wrap',
                      fontSize: FontSize.fontSizeText10,
                      color: pressed ? 'white' : 'black',
                      marginBottom: '2%',
                    }}>
                    {title}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
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
                source={
                  cover !== ''
                    ? {uri: cover}
                    : require('../../assets/backgrounds/nuevoproyecto.jpg')
                }
                style={{
                  ...style.imageBackground,
                  backgroundColor: cover ? 'transparent' : 'grey',
                }}>
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
                      paddingHorizontal: RFPercentage(0.5),
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
              <View
                style={{
                  ...style.imageBackgroundImportants,
                  backgroundColor: cover ? 'transparent' : 'grey',
                  borderTopLeftRadius: 10,
                  borderTopRightRadius: 10,
                }}>
                <Image
                  source={
                    cover !== ''
                      ? {uri: cover}
                      : require('../../assets/backgrounds/nuevoproyecto.jpg')
                  }
                  style={{
                    width: '100%',
                    height: '100%',
                    // resizeMode: 'cover',
                  }}
                />
              </View>
              <View
                style={{marginHorizontal: 14, marginTop: 13, marginBottom: 6}}>
                <Text
                  style={{
                    // backgroundColor: 'white',
                    marginBottom: 9,
                    alignSelf: 'flex-start',
                    fontSize: FontSize.fontSizeText13
                  }}>
                  {title.length > 15 ? title.slice(0, 14) + '...': title}
                </Text>
                <Text
                  style={{
                    // backgroundColor: 'white',
                    alignSelf: 'flex-start',
                    color: 'blue',
                  }}>
                  {/* {description} */}
                  {description.length > 20
                    ? description.slice(0, 20) + '...'
                    : description}
                </Text>
                <View
                  style={{
                    marginTop: '15%',
                    flexDirection: 'row',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                    // backgroundColor:'red'
                  }}>
                  {/* <IconBootstrap name={'plus'} size={20} color={'black'} /> */}
                  <View style={{flexDirection: 'row'}}>
                    <People width={16} height={16} color={'#000000'} />
                    <Text
                      style={{
                        fontSize: FontSize.fontSizeText13,
                        marginHorizontal: RFPercentage(1),
                      }}>
                      1500
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={onLike}
                    style={{flexDirection: 'row'}}>
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
                      {totalLikes}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      case 'importantsPlus':
        return (
          <TouchableOpacity style={style.importants} onPress={onPress}>
            <View style={{alignItems: 'center',
            height: '100%',}}>
              <View
                style={{
                  
                  alignSelf: 'center',
                  padding: '30%',
                  backgroundColor: 'transparent',
                  marginHorizontal: 14,
                  marginTop: 0,
                  marginBottom: RFPercentage(0.6),
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
                source={
                  cover !== ''
                    ? {uri: cover}
                    : require('../../assets/backgrounds/nuevoproyecto.jpg')
                }
                style={{...style.imageBackground}}>
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
                    {title}
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
                    {description.length > 20
                      ? description.slice(0, 20) + '...'
                      : description}
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
              <View
                style={{
                  ...style.imageBackgroundOrganization,
                  backgroundColor: cover ? 'transparent' : 'grey',
                  borderRadius: 100,
                }}>
                <Image
                  source={
                    cover !== ''
                      ? {uri: cover}
                      : require('../../assets/backgrounds/nuevoproyecto.jpg')
                  }
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: 100,
                    // resizeMode: 'cover',
                  }}
                />
              </View>
              <View style={{alignItems: 'stretch'}}>
                <Text
                  style={{
                    textAlign: 'center',
                    marginBottom: '7%',
                    marginLeft: '10%',
                    marginRight: '10%',
                    marginTop: '5%',
                    //   backgroundColor: 'red',
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}>
                  {title}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      case 'organizationPlus':
        return (
          <TouchableOpacity
            activeOpacity={0.5}
            style={{...style.touchableOrganization, 
            //   shadowColor: '#000',
            // shadowOffset: {
            //   width: 0,
            //   height: 0.1,
            // },
            // shadowOpacity: 0.2,
            // shadowRadius: 1.41,
            // elevation: 1,
          }}
            onPress={onPress}>
            <View>
              <View
                style={{
                  ...style.imageBackgroundOrganization,
                   
                }}>
                <Plus
                  style={{alignSelf: 'center', bottom: RFPercentage(-2)}}
                  height={60}
                  width={60}
                />
              </View>
              <View style={{alignItems: 'stretch'}}>
                <Text
                  style={{
                    textAlign: 'center',
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
            <View
              style={{
                paddingHorizontal: RFPercentage(3),
                // width:'100%',
                // backgroundColor:'green'
              }}>
              <View
                style={{
                  // marginHorizontal: RFPercentage(2),
                  width: '100%',
                  marginTop: RFPercentage(2),
                  marginBottom: 6,
                }}>
                <Text
                  style={{
                    // backgroundColor: 'blue',
                    marginBottom: '1%',
                    alignSelf: 'flex-start',
                  }}>
                  {title}
                </Text>
                <Text
                  style={{
                    // backgroundColor: 'white',
                    alignSelf: 'flex-start',
                    color: 'blue',
                    marginBottom: '2%',
                  }}>
                  {auxString}
                </Text>
                <Text
                  style={{
                    // backgroundColor: 'red',
                    alignSelf: 'flex-start',
                    marginBottom: '2%',
                    // padding: RFPercentage(1)
                  }}>
                  {description}
                </Text>
              </View>
              <ImageBackground
                // borderRadius={10}
                // source={require(urii)}
                source={
                  cover
                    ? {uri: imageUrl + cover}
                    : require('../../assets/backgrounds/nuevoproyecto.jpg')
                }
                style={{
                  ...style.imageBackground,
                  width: '100%',
                  height: RFPercentage(23),
                  backgroundColor: cover ? 'transparent' : 'grey',
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginHorizontal: RFPercentage(1),
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
                    <Heart width={16} height={16} color={'#000000'} />
                    <Text
                      style={{
                        fontSize: FontSize.fontSizeText13,
                        marginHorizontal: RFPercentage(1),
                      }}>
                      {totalLikes}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={onLike}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: 'white',
                      borderRadius: 15,
                      margin: '2%',
                      marginVertical: RFPercentage(0.8),
                      // paddingHorizontal: '3%',
                      paddingVertical: '2%',
                      flex: 1,
                      alignItems:'center',
                    }}>
                    <Text
                      style={{
                        fontSize: FontSize.fontSizeText13,
                        marginHorizontal: RFPercentage(1),
                      }}>
                      {totalLikes}
                    </Text>

                    {boolHelper ? (
                      <HeartFill width={16} height={16} color={'#ff0000'} />
                    ) : (
                      <Heart width={16} height={16} color={'#000000'} />
                    )}
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </View>
          </TouchableOpacity>
        );
      case 'organizationFound':
        return (
          <TouchableOpacity
            activeOpacity={0.5}
            style={style.organizationFound}
            onPress={onPress}>
            <View
              style={{
                flexDirection: 'row',
                // backgroundColor: 'red'
              }}>
              <View
                style={{
                  alignSelf: 'center',
                  width: '30%',
                  alignContent: 'center',
                  alignItems: 'center',
                  // backgroundColor: 'blue',
                }}>
                {/* <ImageBackground
                  borderRadius={100}
                  // source={require(urii)}
                  source={require('../../assets/backgrounds/login-background.jpg')}
                  style={{
                    height: RFPercentage(12),
                    width: RFPercentage(12),
                  }}></ImageBackground> */}
                <View
                  style={{
                    height: RFPercentage(12),
                    width: RFPercentage(12),
                    backgroundColor: cover ? 'transparent' : 'grey',
                    borderRadius: 100,
                  }}>
                  <Image
                    source={
                      cover !== ''
                        ? {uri: cover}
                        : require('../../assets/backgrounds/nuevaorganizacion.jpg')
                    }
                    style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: 100,
                      // resizeMode: 'cover',
                    }}
                  />
                </View>
              </View>

              <View
                style={{
                  marginHorizontal: RFPercentage(1),
                  marginTop: 13,
                  justifyContent: 'center',
                  marginBottom: 6,
                  width: '70%',
                }}>
                <Text
                  style={{
                    // backgroundColor: 'white',
                    marginBottom: '1%',
                    alignSelf: 'flex-start',
                    fontWeight: 'bold',
                    fontSize: FontSize.fontSizeText14,
                  }}>
                  {title}
                </Text>

                <Text
                  style={{
                    // backgroundColor: 'white',
                    alignSelf: 'flex-start',
                    marginBottom: '4%',
                    fontSize: FontSize.fontSizeText13,
                  }}>
                  {description.length > 30
                    ? description.slice(0, 30) + '...'
                    : description}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      case 'projectOrganization':
        return (
          <>
            <TouchableOpacity
              activeOpacity={0.5}
              style={style.projectOrganization}
              onPress={onPress}>
              <View
                style={{
                  alignSelf: 'center',
                  width: '30%',
                  // alignContent: 'center',
                  // alignItems: 'center',
                  // backgroundColor: 'blue',
                }}>
                <ImageBackground
                  // borderRadius={10}
                  borderBottomLeftRadius={10}
                  borderTopLeftRadius={10}
                  // source={require(urii)}
                  source={
                    cover !== ''
                      ? {uri: cover}
                      : require('../../assets/backgrounds/nuevoproyecto.jpg')
                  }
                  style={{height: '100%'}}>
                  <View style={{alignItems: 'stretch', flex: 1}}>
                    <Text
                      style={{
                        // textAlign: 'center',
                        marginBottom: '1%',
                        marginLeft: '10%',
                        marginRight: '10%',
                        top: RFPercentage(9),
                        backgroundColor: 'white',
                        alignSelf: 'flex-start',
                      }}>
                      {/* {title} */}
                      {title.length > 20 ? title.slice(0, 20) + '...' : title}
                      {/* titulazo que tiene mas de 20 caracteres y que  */}
                    </Text>
                  </View>
                </ImageBackground>
              </View>

              <View
                style={{
                  // marginHorizontal: RFPercentage(1),
                  marginTop: RFPercentage(1),
                  // marginBottom: 6,
                  width: '70%',
                }}>
                <Text
                  style={{
                    // backgroundColor: 'white',
                    alignSelf: 'stretch',
                    marginTop: '4%',
                    marginHorizontal: RFPercentage(2),
                    fontSize: FontSize.fontSizeText13,
                    height: '60%',
                  }}>
                  {description}
                </Text>
                <View
                  style={{
                    marginBottom: RFPercentage(0),
                    marginHorizontal: RFPercentage(2),
                    flexDirection: 'row',
                    alignContent: 'center',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    alignSelf: 'stretch',
                    height: '30%',
                  }}>
                  {/* personas */}
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    {/* <IconBootstrap name={'plus'} size={20} color={'black'} /> */}
                    <People
                      width={RFPercentage(2)}
                      height={RFPercentage(2)}
                      color={'#000000'}
                    />
                    <Text
                      style={{
                        fontSize: FontSize.fontSizeText13,
                        marginHorizontal: RFPercentage(1),
                        alignSelf: 'center',
                      }}>
                      1500
                    </Text>
                  </TouchableOpacity>

                  {/*favorito */}
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <HeartFill
                      width={RFPercentage(2)}
                      height={RFPercentage(2)}
                      color={'#ff0000'}
                    />
                    {/* {boolHelper ? (
                    <HeartFill width={16} height={16} color={'#ff0000'} />
                  ) : (
                    <Heart width={16} height={16} color={'#000000'} />
                  )} */}
                    <Text
                      style={{
                        fontSize: FontSize.fontSizeText13,
                        marginHorizontal: RFPercentage(1),
                        alignSelf: 'center',
                      }}>
                      120
                    </Text>
                  </TouchableOpacity>

                  {/* ver mas */}
                  <View
                    style={{
                      width: RFPercentage(10),
                      marginHorizontal: RFPercentage(0),
                      bottom: 2,
                      borderRadius: 100,
                    }}>
                    <CustomButton
                      onPress={() => console.log('pressed')}
                      label="Ver más "
                      backgroundColor={Colors.primaryLigth}
                      iconRight="arrow-right"
                      iconColor="white"
                    />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </>
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
    height: RFPercentage(15),
    width: RFPercentage(11.5),
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
  newProject: {
    height: RFPercentage(13),
    width: RFPercentage(19),
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
    // height: RFPercentage(30),
    height: heightPercentageToDP(30),
    width: widthPercentageToDP(50),
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
    height: '57%',
    // borderRadius: 10,
  },

  interesting: {
    height: '90%',
    width: widthPercentageToDP(40),
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
    height: heightPercentageToDP(12),
    width: widthPercentageToDP(27),
    // borderRadius: 10,
    alignSelf: 'center',
    // padding: '30%',
  },
  touchableOrganization: {
    // height: '100%',
    width: RFPercentage(18),
    margin: 4,
    borderRadius: 100,
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
    width: widthPercentageToDP(100),
    marginVertical: widthPercentageToDP(5),
    borderRadius: 10,
  },
  organizationFound: {
    // height: '100%',
    flexShrink: 1,
    width: '100%',
    marginVertical: RFPercentage(2),
    // borderRadius: 10,
  },
  projectOrganization: {
    width: '95%',
    height: RFPercentage(17),
    alignSelf: 'center',
    // backgroundColor:'green',
    marginVertical: RFPercentage(3),
    // marginHorizontal:20,
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 0.1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 1,
    flexDirection: 'row',
  },
});
