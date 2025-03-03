import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Share,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import articles from '../components/articles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fontPoppinsRegular = 'Poppins-Regular';
const fontCormorantRegular = 'Cormorant-Regular';

const ArticlesScreen = ({ setSelectedScreen, savedReginasArticles, setSavedReginasArticles, isArticleDetailsVisible, setIsArticleDetailsVisible, selectedArticle, setSelectedArticle }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));



  const shareArticle = async () => {
    try {
      await Share.share({
        message: `Read article "${selectedArticle.title} in the Regina's Green Glow app!`,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };


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

  return (
    <SafeAreaView style={{
      display: 'flex',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',

      flex: 1
    }}>
      {!isArticleDetailsVisible ? (
        <>
          <Text
            style={{
              fontFamily: fontCormorantRegular,
              textAlign: "left",
              fontSize: dimensions.width * 0.07,
              alignSelf: 'center',
              fontWeight: 500,
              color: 'black',
              paddingHorizontal: dimensions.width * 0.05,
            }}
          >
            Explore insightful reads on skincare, wellness, and eco-friendly beauty
          </Text>


          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{
              paddingBottom: dimensions.height * 0.16,
              marginTop: dimensions.height * 0.03,
            }}>
              {articles.map((article, index) => (
                <TouchableOpacity
                  key={article.id}
                  onPress={() => {
                    setSelectedArticle(article);
                    setIsArticleDetailsVisible(true);
                  }}
                  style={{
                    width: dimensions.width * 0.9,
                    alignSelf: 'center',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: dimensions.height * 0.03,
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
                      {article.title}
                    </Text>
                    <Text
                      style={{
                        fontFamily: fontPoppinsRegular,
                        color: 'black',
                        fontSize: dimensions.width * 0.034,
                        textAlign: 'left',
                        fontWeight: 400,
                      }}>
                      {article.article.length > 100
                        ? article.article.substring(0, 100) + '...'
                        : article.article}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => {
                      saveReginasArticle(article);
                    }}
                    style={{
                      borderRadius: dimensions.width * 0.5,
                      backgroundColor: isReginaArticleSaved(article) ? '#005B41' : '#D2C780',
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
              ))}
            </View>
          </ScrollView>
        </>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{
            marginBottom: dimensions.height * 0.16,
 
          }}>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: dimensions.width * 0.9,
              alignSelf: 'center',
            }}>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start'
              }}>
                <TouchableOpacity
                  onPress={() => {
                    saveReginasArticle(selectedArticle);
                  }}
                  style={{
                    borderRadius: dimensions.width * 0.073,
                    marginRight: dimensions.width * 0.03,
                    backgroundColor: isReginaArticleSaved(selectedArticle) ? '#005B41' : '#D2C780',
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



                <TouchableOpacity
                  onPress={() => {
                    shareArticle();
                  }}
                  style={{
                    borderRadius: dimensions.width * 0.075,
                    backgroundColor: '#D2C780',
                    padding: dimensions.height * 0.023,
                  }}>
                  <Image
                    source={require('../assets/icons/shareIcon.png')}
                    style={{
                      width: dimensions.height * 0.028,
                      height: dimensions.height * 0.028,
                    }}
                  />

                </TouchableOpacity>
              </View>



              <TouchableOpacity
                onPress={() => {
                  setSelectedArticle(null);
                  setIsArticleDetailsVisible(false);
                }}
                style={{
                  borderRadius: dimensions.width * 0.1,
                  backgroundColor: '#005B41',
                  padding: dimensions.height * 0.025,
                }}>
                  
                <Image
                  source={require('../assets/icons/xcircleIcon.png')}
                  style={{
                    width: dimensions.height * 0.025,
                    height: dimensions.height * 0.025,
                  }}
                />

              </TouchableOpacity>
            </View>
            <Text
              style={{
                fontFamily: fontCormorantRegular,
                textAlign: "left",
                fontSize: dimensions.width * 0.07,
                alignSelf: 'center',
                fontWeight: 500,
                color: 'black',
                paddingHorizontal: dimensions.width * 0.05,
                marginTop: dimensions.height * 0.03,
              }}
            >
              {selectedArticle.title}
            </Text>


            <Text
              style={{
                fontFamily: fontPoppinsRegular,
                textAlign: "left",
                fontSize: dimensions.width * 0.039,
                alignSelf: 'center',
                fontWeight: 400,
                color: 'black',
                paddingHorizontal: dimensions.width * 0.05,
                marginTop: dimensions.height * 0.03,
              }}
            >
              {selectedArticle.article}
            </Text>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default ArticlesScreen;
