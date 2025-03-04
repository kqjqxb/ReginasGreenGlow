import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Animated,
  Modal,
  Easing,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';

const fontPoppinsRegular = 'Poppins-Regular';
const things = [
  {
    id: 1,
    image: require('../assets/images/bubblesImages/redMediumBubbleImage.png'),
  },
  {
    id: 2,
    image: require('../assets/images/bubblesImages/redMediumBubbleImage.png'),
  },
  {
    id: 3,
    image: require('../assets/images/bubblesImages/redMediumBubbleImage.png'),
  },
  {
    id: 4,
    image: require('../assets/images/bubblesImages/bigBubbleImage.png'),
  },
  {
    id: 5,
    image: require('../assets/images/bubblesImages/bigBubbleImage.png'),
  },
  {
    id: 6,
    image: require('../assets/images/bubblesImages/bigBubbleImage.png'),
  },
];

const BubblesScreen = ({ setSelectedScreen }) => {
  const [dimensions] = useState(Dimensions.get('window'));
  const timerAnim = useRef(new Animated.Value(75)).current;
  const [modalVisible, setModalVisible] = useState(false);
  const [restartBubbleTimer, setRestartBubbleTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [bubbleGameReason, setBubbleGameReason] = useState('');
  const [fallingBubbles, setFallingBubbles] = useState([]);

  const spawnBubbles = () => {
    const randomIndex = Math.floor(Math.random() * things.length);
    const chosenImg = things[randomIndex];
    const { id: ignored, ...chosenImgWithoutId } = chosenImg;
    
    const id = Math.floor(100000 + Math.random() * 900000);
    
    const randX = Math.random() * (dimensions.width - 40);
    const size = dimensions.height * (0.05 + Math.random() * (0.091 - 0.05));
    
    const newItem = {
      id,
      x: randX,
      y: new Animated.Value(-50),
      caught: false,
      size,
      ...chosenImgWithoutId,
    };
    
    setFallingBubbles((prev) => [...prev, newItem]);
    
    Animated.timing(newItem.y, {
      toValue: dimensions.height + 50,
      duration: 3400,
      useNativeDriver: false,
    }).start(() => {
      setTimeout(() => {
        setFallingBubbles((prev) => prev.filter((f) => f.id !== newItem.id));
      }, 0)
    });
  };

  useEffect(() => {
    if(modalVisible && bubbleGameReason !== 'pause') 
      timerAnim.setValue(75);
    Animated.timing(timerAnim, {
      toValue: 0,
      duration: 75000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        setModalVisible(true);
        setBubbleGameReason('time');
      }
    });
  }, [restartBubbleTimer, modalVisible]);

  const progressWidth = timerAnim.interpolate({
    inputRange: [0, 75],
    outputRange: [0, dimensions.width * 0.7],
  });

  useEffect(() => {
    let timerId = null;
    if (!modalVisible) {
      timerId = setInterval(() => {
        if (!modalVisible) {
          spawnBubbles();
        }
      }, 700);
    }
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [modalVisible,]);

  return (
    <View style={{ flex: 1, width: dimensions.width, height: dimensions.height }}>
      <View
        style={{
          width: dimensions.width,
          height: dimensions.height * 0.88,
          alignSelf: 'center',
          alignItems: 'center',
          zIndex: 1,
        }}
      >
        <SafeAreaView
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: dimensions.width * 0.9,
          }}
        >
          <View
            style={{
              backgroundColor: '#D2C780',
              borderRadius: dimensions.width * 0.1,
              width: dimensions.width * 0.7,
              height: dimensions.height * 0.01,
            }}
          >
            <Animated.View
              style={{
                backgroundColor: '#005B41',
                borderRadius: dimensions.width * 0.1,
                height: dimensions.height * 0.01,
                width: progressWidth,
              }}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(true);
              setBubbleGameReason('pause');
            }}
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: dimensions.height * 0.023,
              width: dimensions.width * 0.16,
              height: dimensions.width * 0.16,
              backgroundColor: '#005B41',
              borderRadius: dimensions.width * 0.1,
              paddingVertical: dimensions.height * 0.01,
              zIndex: 999
            }}
          >
            <Image
              source={require('../assets/icons/xcircleIcon.png')}
              style={{
                width: dimensions.height * 0.031,
                height: dimensions.height * 0.031,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </SafeAreaView>

        {fallingBubbles.map((item) => (
          <Animated.View
            key={item.id}
            style={{
              position: 'absolute',
              left: item.x,
              top: item.y,
              zIndex: 50,
            }}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => {
                setScore((prev) => prev + 1);
                setFallingBubbles((prev) => prev.filter((f) => f.id !== item.id));
              }}
            >
              <Image
                source={item.image}
                style={{
                  width: item.size,
                  height: item.size,
                  resizeMode: 'contain',
                  zIndex: 50
                }}
              />
            </TouchableOpacity>
          </Animated.View>
        ))}
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
              {bubbleGameReason === 'pause' ? 'Game Paused' : 'Game Over!'}
            </Text>
            <Text style={{
              paddingHorizontal: dimensions.width * 0.073,
              textAlign: 'center',
              fontFamily: fontPoppinsRegular,
              fontSize: dimensions.width * 0.034,
              marginBottom: dimensions.height * 0.019,
            }}>
              {bubbleGameReason === 'pause' ? 'Take a breather! Ready to jump back in?' : `You popped 💙 ${score} bubbles! Want to try again? You’re getting better!`}
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
                  setSelectedScreen('Home')
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
                  Menu
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
                  setRestartBubbleTimer((prev) => prev + 1)
                }}
              >
                <Text style={{
                  color: '#005B41',
                  textAlign: 'center',
                  fontFamily: fontPoppinsRegular,
                  fontSize: dimensions.width * 0.043,
                  alignSelf: 'center',
                  fontWeight: 600,
                }}>
                  {bubbleGameReason === 'pause' ? 'Resume' : 'Play Again'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default BubblesScreen;
