import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Share,
  Switch,
  Linking,
  Alert,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import { BlurView } from '@react-native-community/blur';

const fontPoppinsRegular = 'Poppins-Regular';
const fontCormorantRegular = 'Cormorant-Regular';
const appReginasLink = 'https://apps.apple.com/us/app/reginas-green-glow/id6742783280';

const SettingsScreen = ({ setSelectedScreen, isNotificationEnabled, setNotificationEnabled, isMusicEnabled, setIsMusicEnabled  }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [modalVisible, setModalVisible] = useState(false);

  const toggleMusicSwitch = () => {
    const newValue = !isMusicEnabled;
    setIsMusicEnabled(newValue);
    saveSettings('isMusicEnabled', newValue);
  };

  const toggleNotificationSwitch = () => {
    const newValue = !isNotificationEnabled;
    setNotificationEnabled(newValue);
    saveSettings('isNotificationEnabled', newValue);
  };

  const shareReginasApp = async () => {
    try {
      await Share.share({
        message: `Join Regina's Green Glow! \n${appReginasLink}`,
      });
    } catch (error) {
      console.error('Error tip:', error);
    }
  };


  const saveSettings = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  };


  const clearAsyncStorage = async () => {
    try {
      await AsyncStorage.clear();
      RNRestart.Restart();
      console.log('AsyncStorage очищено');
    } catch (error) {
      console.error('Помилка при очищенні AsyncStorage', error);
    }
  };


  const toggleDeleteAppData = () => {
    Alert.alert(
      'Deleting all app data',
      "Are you sure you want to delete Regina's Green Glow app data?",
      [
        {
          text: 'Delete',
          onPress: clearAsyncStorage,
          style: 'default',
          textStyle: { fontWeight: 'normal', color: '#FF3B30' }
        },
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
          textStyle: { fontWeight: 'bold' }
        }
      ],
      { cancelable: false }
    );
  }




  return (
    <SafeAreaView style={{
      display: 'flex',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',

      flex: 1
    }}>
      <Text
        style={{
          fontFamily: fontCormorantRegular,
          textAlign: "left",
          fontSize: dimensions.width * 0.088,
          alignSelf: 'flex-start',
          fontWeight: 500,
          color: 'black',
          paddingHorizontal: dimensions.width * 0.05,
        }}
      >
        Settings
      </Text>
      <View style={{
        width: dimensions.width * 0.9,
        alignSelf: 'center',
        marginTop: dimensions.width * 0.025,
        borderRadius: dimensions.width * 0.05,
        paddingVertical: dimensions.width * 0.01,

      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
          borderBottomColor: '#D2C780',
          borderBottomWidth: 0.7,
          borderRadius: 8,
        }}>
          <Text style={{
            color: '#000000',
            fontSize: dimensions.width * 0.044,
            fontFamily: fontPoppinsRegular,
          }}>Notifications</Text>
          <Switch
            trackColor={{ false: '#948ea0', true: '#005B41' }}
            thumbColor={'#FFFFFF'}
            ios_backgroundColor="#3E3E3E"
            onValueChange={toggleNotificationSwitch}
            value={isNotificationEnabled}
          />
        </View>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
          borderBottomColor: '#D2C780',
          borderBottomWidth: 0.7,
          borderRadius: 8,
        }}>
          <Text style={{
            color: '#000000',
            fontSize: dimensions.width * 0.044,
            fontFamily: fontPoppinsRegular,
          }}>Music</Text>
          <Switch
            trackColor={{ false: '#948ea0', true: '#005B41' }}
            thumbColor={'#FFFFFF'}
            ios_backgroundColor="#3E3E3E"
            onValueChange={toggleMusicSwitch}
            value={isMusicEnabled}
          />
        </View>



        <TouchableOpacity 
          onPress={shareReginasApp}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
          borderBottomColor: '#D2C780',
          borderBottomWidth: 0.7,
          borderRadius: 8,
        }}>
          <Text style={{
            color: '#000000',
            fontSize: dimensions.width * 0.044,
            fontFamily: fontPoppinsRegular,
          }}>Share the app</Text>
          <Image 
            source={require('../assets/icons/shareTheAppIcon.png')}
            style={{
              width: dimensions.width * 0.088,
              height: dimensions.width * 0.088,
            }}
            resizeMode='contain'
          />
        </TouchableOpacity>



        <TouchableOpacity 
          onPress={() => {
            setModalVisible(true);
          }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
          borderBottomColor: '#D2C780',
          borderBottomWidth: 0.7,
          borderRadius: 8,
        }}>
          <Text style={{
            color: '#000000',
            fontSize: dimensions.width * 0.044,
            fontFamily: fontPoppinsRegular,
          }}>Reset all data</Text>
          <Image 
            source={require('../assets/icons/resetDataIcon.png')}
            style={{
              width: dimensions.width * 0.088,
              height: dimensions.width * 0.088,
            }}
            resizeMode='contain'
          />
        </TouchableOpacity>
        



        <TouchableOpacity 
          onPress={() => {
            Linking.openURL('https://www.termsfeed.com/live/db41bfa6-4653-4bfa-bf56-aaa37bfb3f00');
          }}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: 10,
        }}>
          <Text style={{
            color: '#000000',
            fontSize: dimensions.width * 0.044,
            fontFamily: fontPoppinsRegular,
            fontWeight: 400,
          }}>Terms of use</Text>
          
        </TouchableOpacity>


      </View>


      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.45)',
        }}>
          <BlurView
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
            }}
            blurType="light"
            blurAmount={3}
            reducedTransparencyFallbackColor="white"
          />

          <View style={{
            paddingHorizontal: 0,
            backgroundColor: 'white',
            borderRadius: dimensions.width * 0.05,
            paddingTop: dimensions.width * 0.07,
            alignItems: 'center',
            width: dimensions.width * 0.8,
          }}>
            <Text style={{
              fontSize: dimensions.width * 0.044,
              marginBottom: dimensions.height * 0.019,
              textAlign: 'center',
              fontFamily: fontPoppinsRegular,
              paddingHorizontal: dimensions.width * 0.073,
              fontWeight: 500,
              alignSelf: 'center',
            }}>
              Deleting all app data
            </Text>
            <Text style={{
              paddingHorizontal: dimensions.width * 0.073,
              textAlign: 'center',
              fontFamily: fontPoppinsRegular,
              fontSize: dimensions.width * 0.034,
              marginBottom: dimensions.height * 0.019,
            }}>
              Are you sure you want to delete all Regina's Green Glow app data?
            </Text>
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: dimensions.width * 0.8,
              borderTopColor: '#3C3C435C',
              borderTopWidth: dimensions.width * 0.0019,
              paddingHorizontal: dimensions.width * 0.07,
            }}>
              <TouchableOpacity
                style={{
                  paddingVertical: dimensions.height * 0.021,
                  alignItems: 'center',
                  justifyContent: 'center',
                  alignSelf: 'center',
                  width: '44%',
                }}
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                <Text style={{
                  color: '#090814',
                  fontSize: dimensions.width * 0.044,
                  textAlign: 'center',
                  alignSelf: 'center',
                  fontWeight: 400,
                  fontFamily: fontPoppinsRegular,
                }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <View style={{
                height: '100%',
                borderLeftWidth: dimensions.width * 0.0019,
                paddingVertical: dimensions.height * 0.021,
                borderLeftColor: '#3C3C435C',
              }} />
              <TouchableOpacity
                style={{
                  paddingVertical: dimensions.height * 0.021,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '44%',
                }}
                onPress={() => {
                  setModalVisible(false);
                  clearAsyncStorage();
                }}
              >
                <Text style={{
                  color: '#FF3B30',
                  textAlign: 'center',
                  fontFamily: fontPoppinsRegular,
                  fontSize: dimensions.width * 0.043,
                  alignSelf: 'center',
                  fontWeight: 600,
                }}>
                  Delete
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default SettingsScreen;
