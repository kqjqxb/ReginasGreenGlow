import React, { useEffect, useState, useRef, use } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import ArticlesScreen from './ArticlesScreen';
import LevelsScreen from './LevelsScreen';
import CatchScreen from './CatchScreen';

const fontPoppinsRegular = 'Poppins-Regular';
const fontCormorantRegular = 'Cormorant-Regular';

import articles from '../components/articles';
import SettingsScreen from './SettingsScreen';
import JournalScreen from './JournalScreen';


const bottomBtns = [
  {
    id: 1,
    screen: 'Home',
    whiteIcon: require('../assets/icons/whiteIcons/homeIcon.png'),
    yellowIcon: require('../assets/icons/yellowIcons/homeIcon.png'),
  },
  {
    id: 2,
    screen: 'Articles',
    whiteIcon: require('../assets/icons/whiteIcons/articleIcon.png'),
    yellowIcon: require('../assets/icons/yellowIcons/articleIcon.png'),
  },
  {
    id: 3,
    screen: 'Checklist',
    whiteIcon: require('../assets/icons/whiteIcons/checklistIcon.png'),
    yellowIcon: require('../assets/icons/yellowIcons/checklistIcon.png'),
  },
  {
    id: 4,
    screen: 'BubblesGame',
    whiteIcon: require('../assets/icons/whiteIcons/bubblesIcon.png'),
    yellowIcon: require('../assets/icons/yellowIcons/bubblesIcon.png'),
  },
  {
    id: 5,
    screen: 'Settings',
    whiteIcon: require('../assets/icons/whiteIcons/settingsIcon.png'),
    yellowIcon: require('../assets/icons/yellowIcons/settingsIcon.png'),
  },

]


const HomeScreen = () => {

  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedScreen, setSelectedScreen] = useState('Home');
  const [savedReginasArticles, setSavedReginasArticles] = useState([]);
  const [randReginaArticle, setRandReginaArticle] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [isArticleDetailsVisible, setIsArticleDetailsVisible] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [isNotificationEnabled, setNotificationEnabled] = useState(true);

  useEffect(() => {
    const randArticle = articles[Math.floor(Math.random() * articles.length)];
    setRandReginaArticle(randArticle);
    console.log('randArticle:', randArticle);
  }, [])

  useEffect(() => {
    const fetchSavedReginasArticles = async () => {
      try {
        const reginasArticles = await AsyncStorage.getItem('savedReginasArticles');
        setSavedReginasArticles(reginasArticles ? JSON.parse(reginasArticles) : []);
      } catch (error) {
        console.error('error downloading placesInfo:', error);
      }
    };

    fetchSavedReginasArticles();
  }, [selectedScreen]);


  const saveReginasArticle = async (place) => {
    try {
      const savedArticles = await AsyncStorage.getItem('savedReginasArticles');
      const parsedReginasArticles = savedArticles ? JSON.parse(savedArticles) : [];

      const thisArticleIndex = parsedReginasArticles.findIndex((loc) => loc.id === place.id);

      if (thisArticleIndex === -1) {
        const updatedArticlesList = [place, ...parsedReginasArticles];
        await AsyncStorage.setItem('savedReginasArticles', JSON.stringify(updatedArticlesList));
        setSavedReginasArticles(updatedArticlesList);
        console.log('article was saved');
      } else {
        const updatedArticlesList = parsedReginasArticles.filter((loc) => loc.id !== place.id);
        await AsyncStorage.setItem('savedReginasArticles', JSON.stringify(updatedArticlesList));
        setSavedReginasArticles(updatedArticlesList);
        console.log('article was deleted');
      }
    } catch (error) {
      console.error('error of save/delete reginas article:', error);
    }
  };
  const isReginaArticleSaved = (article) => {
    return savedReginasArticles.some((art) => art.id === article.id);
  };


  const loadSettings = async () => {
    try {
      const vibrationValue = await AsyncStorage.getItem('isMusicEnabled');
      const notificationValue = await AsyncStorage.getItem('isNotificationEnabled');

      if (vibrationValue !== null) setIsMusicEnabled(JSON.parse(vibrationValue));
      if (notificationValue !== null) setNotificationEnabled(JSON.parse(notificationValue));
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  useEffect(() => {
    loadSettings();
  }, [isNotificationEnabled, selectedScreen]);


  return (
    <View style={{
      flex: 1,
      width: dimensions.width,
      height: dimensions.height,
      backgroundColor: '#F1EED6',
    }}>
      {selectedScreen === 'Home' ? (
        <SafeAreaView style={{
          flex: 1,
          paddingHorizontal: dimensions.width * 0.05,
          width: dimensions.width,
        }}>

          <View style={{
            marginBottom: dimensions.height * 0.05,
          }}>
            <Image
              source={require('../assets/images/reginasHomeImage.png')}
              style={{
                width: dimensions.width,
                height: dimensions.height * 0.23,
                alignSelf: 'center',
                textAlign: 'center'
              }}
              resizeMode="stretch"
            />


            <Text
              style={{
                fontFamily: fontCormorantRegular,
                color: 'black',
                fontSize: dimensions.width * 0.053,
                textAlign: 'left',
                alignSelf: 'center',
                paddingHorizontal: dimensions.width * 0.05,
                marginTop: dimensions.height * 0.025,
                fontWeight: 500,
              }}>
              Your skin, hair, and well-being change every day—so why not keep a journal to notice what works best for you? 🌿✨
            </Text>

            <TouchableOpacity
              onPress={() => {
                setSelectedScreen('Game');
              }}
              style={{
                backgroundColor: '#005B41',
                borderRadius: dimensions.width * 0.5,
                paddingVertical: dimensions.height * 0.019,
                alignSelf: 'center',
                width: dimensions.width * 0.9,
                marginVertical: dimensions.height * 0.019
              }}
            >
              <Text
                style={{
                  fontFamily: fontPoppinsRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.044,
                  textAlign: 'center',
                  fontWeight: 400,
                }}>
                Start your journey today
              </Text>
            </TouchableOpacity>


            <Text
              style={{
                fontFamily: fontCormorantRegular,
                color: 'black',
                fontSize: dimensions.width * 0.053,
                textAlign: 'left',
                alignSelf: 'center',
                paddingHorizontal: dimensions.width * 0.05,
                fontWeight: 500,
              }}>
              Start exploring now and find something inspiring to save!
            </Text>


            <TouchableOpacity
              onPress={() => {
                setSelectedScreen('Game');
              }}
              style={{
                backgroundColor: '#D2C780',
                borderRadius: dimensions.width * 0.5,
                paddingVertical: dimensions.height * 0.019,
                alignSelf: 'center',
                width: dimensions.width * 0.9,
                marginVertical: dimensions.height * 0.019
              }}
            >
              <Text
                style={{
                  fontFamily: fontPoppinsRegular,
                  color: 'white',
                  fontSize: dimensions.width * 0.044,
                  textAlign: 'center',
                  fontWeight: 400,
                }}>
                Browse Articles
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={{
              width: dimensions.width * 0.9,
              alignSelf: 'center',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
            }}>
              <View style={{
                maxWidth: dimensions.width * 0.7,
              }}>
                <Text
                  style={{
                    fontFamily: fontPoppinsRegular,
                    color: 'black',
                    fontSize: dimensions.width * 0.043,
                    textAlign: 'left',
                    fontWeight: 500,
                  }}>
                  {randReginaArticle?.title}
                </Text>
                <Text
                  style={{
                    fontFamily: fontPoppinsRegular,
                    color: 'black',
                    fontSize: dimensions.width * 0.034,
                    textAlign: 'left',
                    fontWeight: 400,
                  }}>
                  {randReginaArticle?.article.length > 100
                    ? randReginaArticle?.article.substring(0, 100) + '...'
                    : randReginaArticle?.article}
                </Text>
              </View>

              <TouchableOpacity 
              onPress={() => {
                saveReginasArticle(randReginaArticle);
              }}
              style={{
                borderRadius: dimensions.width * 0.5,
                backgroundColor: isReginaArticleSaved(randReginaArticle) ? '#005B41' : '#D2C780',
                padding: dimensions.height * 0.025,
              }}>
                <Image 
                  source={require('../assets/icons/whiteStarIcon.png')}
                  style={{
                    width: dimensions.height * 0.025,
                    height: dimensions.height * 0.025,
                  }}
                />

              </TouchableOpacity>

            </TouchableOpacity>
          </View>
        </SafeAreaView>
      ) : selectedScreen === 'Articles' ? (
        <ArticlesScreen setSelectedScreen={setSelectedScreen} savedReginasArticles={savedReginasArticles} setSavedReginasArticles={setSavedReginasArticles}
          isArticleDetailsVisible={isArticleDetailsVisible} setIsArticleDetailsVisible={setIsArticleDetailsVisible} selectedArticle={selectedArticle} setSelectedArticle={setSelectedArticle}
        />
      ) : selectedScreen === 'Settings' ? (
        <SettingsScreen setSelectedScreen={setSelectedScreen} selectedScreen={selectedScreen} 
          setNotificationEnabled={setNotificationEnabled} isNotificationEnabled={isNotificationEnabled}
          isMusicEnabled={isMusicEnabled} setIsMusicEnabled={setIsMusicEnabled}
        />
      ) : selectedScreen === 'Checklist' ? (
        <JournalScreen setSelectedScreen={setSelectedScreen}  />
      ) : selectedScreen === 'Game' ? (
        <CatchScreen setSelectedScreen={setSelectedScreen} selectedLevel={selectedLevel} setSelectedLevel={setSelectedLevel} />
      ) : null}



      <View
        style={{
          position: 'absolute',
          bottom: dimensions.height * 0.035,
          backgroundColor: '#D2C780',
          width: dimensions.width * 0.826,
          paddingHorizontal: dimensions.width * 0.01,
          borderRadius: dimensions.width * 0.5,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          paddingVertical: dimensions.height * 0.003,
          zIndex: 5000,
          borderColor: 'white',
          borderWidth: dimensions.width * 0.0025,
        }}
      >
        {bottomBtns.map((button, index) => (
          <TouchableOpacity
            key={button.id}
            onPress={() => setSelectedScreen(button.screen)}
            style={{
              borderRadius: dimensions.width * 0.5,
              padding: dimensions.height * 0.023,
              alignItems: 'center',
              backgroundColor: selectedScreen === button.screen ? '#005B41' : '#F3F4DD',
            }}
          >
            <Image
              source={selectedScreen === button.screen ? button.whiteIcon : button.yellowIcon}
              style={{
                width: dimensions.height * 0.025,
                height: dimensions.height * 0.025,

                textAlign: 'center'
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ))}

      </View>
    </View>
  );
};

export default HomeScreen;
