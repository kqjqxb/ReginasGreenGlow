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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

const fontPoppinsRegular = 'Poppins-Regular';
const fontCormorantRegular = 'Cormorant-Regular';
const appReginasLink = 'https://apps.apple.com/us/app/leonshield-security-assistant/id6742137859';

const SettingsScreen = ({ setSelectedScreen, isNotificationEnabled, setNotificationEnabled, isMusicEnabled, setIsMusicEnabled  }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));

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
        message: `Join Leon Shield - Security Assistent! \n${appReginasLink}`,
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
      'Are you sure you want to delete all app data?',
      [
        {
          text: 'Delete',
          onPress: clearAsyncStorage,
          style: 'default',
          textStyle: { fontWeight: 'normal' }
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
          onPress={toggleDeleteAppData}
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
            Linking.openURL('https://www.reginasgreenglow.com/privacy-policy');
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

    </SafeAreaView>
  );
};

export default SettingsScreen;
