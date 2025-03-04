import React, { useEffect, useRef, useState } from 'react';
import { View, FlatList, Animated, Text, TouchableOpacity, ImageBackground, Dimensions, Image, Platform, SafeAreaView } from 'react-native';
import onboardingReginasData from '../components/onboardingReginasData';
import { useNavigation } from '@react-navigation/native';

const fontPoppinsRegular = 'Poppins-Regular';
const fontCormorantRegular = 'Cormorant-Regular';

const OnboardingScreen = () => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const navigation = useNavigation();
  const [currentReginasSlideIndex, setCurrentReginasSlideIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef(null);

  useEffect(() => {
    const onChange = ({ window }) => {
      setDimensions(window);
    };

    const dimensionListener = Dimensions.addEventListener('change', onChange);

    return () => {
      dimensionListener.remove();
    };
  }, []);

  const viewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentReginasSlideIndex(viewableItems[0].index);
    }
  }).current;

  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const scrollToTheNextReginasSlide = () => {
    if (currentReginasSlideIndex < onboardingReginasData.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentReginasSlideIndex + 1 });
    } else {
      navigation.navigate('Home');
    }
  };

  const renderReginasItem = ({ item }) => (
    <View style={{
      width: dimensions.width,
      flex: 1,
      borderColor: 'white',
      alignItems: 'center',
    }}>
      <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: dimensions.width,
        alignSelf: 'center',
      }}>
        <Image
          resizeMode="contain"
          source={item.image}
          style={{
            width: dimensions.width,
            height: undefined,
            aspectRatio: 1,
          }}
        />
        <Text
          style={{
            fontFamily: fontCormorantRegular,
            fontWeight: 500,
            paddingHorizontal: dimensions.width * 0.03,
            color: 'white',
            textAlign: 'center',
            marginTop: dimensions.height * 0.05,
            fontSize: dimensions.width * 0.059,
          }}>
          {item.description}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView
      style={{ justifyContent: 'space-between', flex: 1, alignItems: 'center', backgroundColor: '#005B41' }}
    >
      <View style={{
        display: 'flex',
        width: dimensions.width,
        height: dimensions.height * 0.7,
        alignSelf: 'center'
      }}>
        <FlatList
          data={onboardingReginasData}
          renderItem={renderReginasItem}
          bounces={false}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          keyExtractor={(item) => item.id.toString()}
          onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], {
            useNativeDriver: false,
          })}
          onViewableItemsChanged={viewableItemsChanged}
          viewabilityConfig={viewConfig}
          scrollEventThrottle={32}
          ref={slidesRef}
        />
      </View>

      <TouchableOpacity
        onPress={() => {
          if (currentReginasSlideIndex === onboardingReginasData.length - 1) {
            navigation.navigate('Home');
          } else scrollToTheNextReginasSlide();
        }}
        style={{
          backgroundColor: '#D2C780',
          borderRadius: dimensions.width * 0.5,
          width: dimensions.width * 0.9,
          paddingVertical: dimensions.height * 0.016,
          marginBottom: 40,
          alignSelf: 'center',
        }}
      >
        <Text
          style={{
            fontFamily: fontPoppinsRegular,
            color: 'white',
            fontSize: dimensions.width * 0.048,
            textAlign: 'center',
            fontWeight: 400,
            textTransform: 'uppercase',
          }}>
          {currentReginasSlideIndex === 0 ? 'Next' : 'Start'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default OnboardingScreen;
