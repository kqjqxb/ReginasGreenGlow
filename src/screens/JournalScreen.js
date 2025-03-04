import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ScrollView } from 'react-native-gesture-handler';

const fontPoppinsRegular = 'Poppins-Regular';
const fontCormorantRegular = 'Cormorant-Regular';
import { BlurView } from '@react-native-community/blur';
import CalendarScreen from './CalendarScreen';

const JournalScreen = ({ setSelectedScreen, }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [isEditindTodayRelfection, setIsEditindTodayRelfection] = useState(false);
  const [feelToday, setFeelToday] = useState('');
  const [selectedSkinFeel, setSelectedSkinFeel] = useState('');
  const [selectedHairFeel, setSelectedHairFeel] = useState('');
  const [changesOfConcerns, setChangesOfConcerns] = useState('');
  const [anythingNew, setAnythingNew] = useState('');
  const [glassesOfWater, setGlassesOfWater] = useState(0);
  const [hoursSleep, setHoursSleep] = useState(0);
  const [reflactions, setReflactions] = useState([]);
  const [todayReflection, setTodayReflection] = useState(null);
  const scrollViewReginasRef = useRef(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [deletingModalVisible, setDeletingModalVisible] = useState(false);
  const [reflectionToDelete, setReflectionToDelete] = useState(null);


  useEffect(() => {
    if (!isEditindTodayRelfection && scrollViewReginasRef.current || isEditindTodayRelfection && scrollViewReginasRef.current) {
      scrollViewReginasRef.current.scrollTo({ y: 0, animated: true });
    }
  }, [isEditindTodayRelfection]);

  const handleSaveTodayReflection = async () => {
    const todayDate = new Date().toISOString().slice(0, 10);
    let newReflectionId;

    const storedToday = await AsyncStorage.getItem('todayReflection');
    if (storedToday !== null) {
      const parsedToday = JSON.parse(storedToday);
      const savedDate = parsedToday.saveDate.slice(0, 10);
      if (savedDate === todayDate) {
        newReflectionId = parsedToday.id;
      }
    }
    if (!newReflectionId) {
      newReflectionId =
        reflactions.length > 0 ? Math.max(...reflactions.map(e => e.id)) + 1 : 1;
    }

    const newReflection = {
      id: newReflectionId,
      glassesOfWater,
      hoursSleep,
      feelToday,
      selectedSkinFeel,
      selectedHairFeel,
      changesOfConcerns,
      anythingNew,
      saveDate: new Date().toISOString(),
    };

    try {
      await AsyncStorage.setItem('todayReflection', JSON.stringify(newReflection));
      console.log('Today Reflection saved');

      const storedReflections = await AsyncStorage.getItem('reflactions');
      const reflectionsArray = storedReflections ? JSON.parse(storedReflections) : [];

      const indexToday = reflectionsArray.findIndex(item =>
        new Date(item.saveDate).toISOString().slice(0, 10) === todayDate
      );
      if (indexToday !== -1) {
        reflectionsArray[indexToday] = newReflection; 
      } else {
        reflectionsArray.push(newReflection); 
      }

      await AsyncStorage.setItem('reflactions', JSON.stringify(reflectionsArray));
      console.log('Reflection updated in the list');

      setTodayReflection(newReflection);
      setReflactions(reflectionsArray);
      setGlassesOfWater(0);
      setHoursSleep(0);
      setFeelToday('');
      setSelectedSkinFeel('');
      setSelectedHairFeel('');
      setChangesOfConcerns('');
      setAnythingNew('');
    } catch (error) {
      console.error('Error saving reflection:', error);
    }
    setIsEditindTodayRelfection(false);
  };

  const retrieveTodayReflection = async () => {
    try {
      const storedReflection = await AsyncStorage.getItem('todayReflection');
      if (storedReflection !== null) {
        const parsedReflection = JSON.parse(storedReflection);
        const savedDate = new Date(parsedReflection.saveDate).toISOString().slice(0, 10);
        const todayDate = new Date().toISOString().slice(0, 10);
        if (savedDate === todayDate) {
          setTodayReflection(parsedReflection);
        } else {
          setTodayReflection(null);
        }
      } else {
        setTodayReflection(null);
      }
    } catch (error) {
      console.error('Error retrieving todayReflection:', error);
    }
  };


  const retrieveReflactions = async () => {
    try {
      const storedReflactions = await AsyncStorage.getItem('reflactions');
      if (storedReflactions !== null) {
        setReflactions(JSON.parse(storedReflactions));
      } else {
        setReflactions([]);
      }
    } catch (error) {
      console.error('Error retrieving reflactions:', error);
    }
  };

  useEffect(() => {
    retrieveTodayReflection();
    retrieveReflactions();
  }, [todayReflection, reflactions]);


  useEffect(() => {
    const scheduleMidnightReset = () => {
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const timeout = nextMidnight - now;
      const timer = setTimeout(() => {
        setTodayReflection(null);
        retrieveTodayReflection();
        scheduleMidnightReset();
      }, timeout);
      return () => clearTimeout(timer);
    };

    const cleanup = scheduleMidnightReset();
    return cleanup;
  }, []);


  const handleDeleteTodayReflaction = async (id) => {
    const updatedReflactions = reflactions.filter(item => item.id !== id);
    setReflactions(updatedReflactions);
    setTodayReflection(null);
    await AsyncStorage.removeItem('todayReflection');
    await AsyncStorage.setItem('reflactions', JSON.stringify(updatedReflactions));
  };


  const selectedReflection = reflactions.find(
    r =>
      new Date(r.saveDate).toISOString().slice(0, 10) ===
      selectedDay.toISOString().slice(0, 10)
  );

  return (
    <SafeAreaView style={{
      display: 'flex',
      alignSelf: 'center',
      width: '100%',
      alignItems: 'center',

      flex: 1
    }}>
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: dimensions.width * 0.9,
        alignSelf: 'center',
      }}>
        <Text
          style={{
            fontFamily: fontCormorantRegular,
            textAlign: "left",
            fontSize: dimensions.width * 0.088,
            alignSelf: 'flex-start',
            fontWeight: 500,
            color: 'black',
          }}
        >
          Beauty journal
        </Text>

        {isEditindTodayRelfection || isCalendarVisible ? (
          <TouchableOpacity
            onPress={() => {
              if (isCalendarVisible) {
                setIsCalendarVisible(false);
              } else {
                if (feelToday !== '' || selectedSkinFeel !== '' || selectedHairFeel !== '' || changesOfConcerns !== '' || anythingNew !== '') {
                  setModalVisible(true);
                } else {
                  setIsEditindTodayRelfection(false)
                }
              }
            }}
            style={{
              backgroundColor: '#005B41',
              borderRadius: dimensions.width * 0.5,
              padding: dimensions.height * 0.019,
            }}>
            <Image
              source={require('../assets/icons/xcircleIcon.png')}
              style={{
                width: dimensions.width * 0.05,
                height: dimensions.width * 0.05,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => setIsCalendarVisible((prev) => !prev)}
          >
            <Image
              source={require('../assets/icons/calendarIcon.png')}
              style={{
                width: dimensions.width * 0.07,
                height: dimensions.width * 0.07,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>


      {!isCalendarVisible ? (
        <>
          {!isEditindTodayRelfection ? (
            <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewReginasRef} disabled={!todayReflection}>
              <View style={{
                paddingBottom: dimensions.height * 0.16,
                width: dimensions.width * 0.9,
                alignSelf: 'center',
              }}>
                <View style={{
                  marginTop: dimensions.height * 0.025,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  width: dimensions.width * 0.9,
                  alignSelf: 'center',
                }}>
                  {Array.from({ length: 4 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    return {
                      date, 
                      day: date.getDate(),
                      dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
                    };
                  }).reverse().map((dateObj, index) => {
                    const isSelected = dateObj.date.toDateString() === selectedDay.toDateString();
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() => setSelectedDay(dateObj.date)}
                        style={{
                          backgroundColor: isSelected ? '#005B41' : '#D2C780',
                          borderRadius: dimensions.width * 0.1,
                          padding: dimensions.width * 0.05,
                          width: dimensions.width * 0.2,
                          height: dimensions.width * 0.2,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontFamily: fontPoppinsRegular,
                            textAlign: 'center',
                            fontSize: dimensions.width * 0.05,
                            fontWeight: 400,
                            color: 'white',
                          }}
                        >
                          {dateObj.day}
                        </Text>
                        <Text
                          style={{
                            fontFamily: fontPoppinsRegular,
                            textAlign: 'center',
                            fontSize: dimensions.width * 0.04,
                            fontWeight: 400,
                            color: '#F1EED6',
                            marginTop: -dimensions.height * 0.01,
                          }}
                        >
                          {dateObj.dayOfWeek}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
                <Text
                  style={{
                    fontFamily: fontCormorantRegular,
                    textAlign: "left",
                    fontSize: dimensions.width * 0.088,
                    alignSelf: 'flex-start',
                    fontWeight: 500,
                    color: 'black',
                    marginTop: dimensions.height * 0.03,
                  }}
                >
                  {selectedReflection ? "Track your daily skin, hair & wellness journey" : "No reflection for this day"}
                </Text>
                {selectedReflection ? (
                  <>

                    <Text
                      style={{
                        fontFamily: fontCormorantRegular,
                        color: '#090814',
                        fontSize: dimensions.width * 0.07,
                        marginTop: dimensions.height * 0.03,
                        textAlign: 'left',
                        fontWeight: 600,
                      }}>
                      Mood & General Feeling
                    </Text>

                    <Text
                      style={{
                        fontFamily: fontPoppinsRegular,
                        color: '#090814',
                        fontSize: dimensions.width * 0.037,
                        textDecorationLine: 'underline',
                        marginTop: dimensions.height * 0.016,
                        textAlign: 'left',
                        fontWeight: 400,
                      }}>
                      Your feeling today:
                    </Text>

                    <Text
                      style={{
                        fontFamily: fontPoppinsRegular,
                        color: '#090814',
                        fontSize: dimensions.width * 0.037,
                        marginTop: dimensions.height * 0.007,
                        textAlign: 'left',
                        fontWeight: 400,
                      }}>
                      {selectedReflection.feelToday}
                    </Text>

                    <Text
                      style={{
                        fontFamily: fontCormorantRegular,
                        color: '#090814',
                        fontSize: dimensions.width * 0.07,
                        marginTop: dimensions.height * 0.03,
                        marginBottom: dimensions.height * 0.01,
                        textAlign: 'left',
                        fontWeight: 600,
                      }}>
                      Skin Condition
                    </Text>

                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '95%',
                      flexWrap: 'wrap',
                    }}>

                      {['Hydrated', 'Dry', 'Oily', 'Sensitive', 'Normal'].map((skinFeel, index) => (
                        <View
                          key={index} style={{
                            borderRadius: dimensions.width * 0.5,
                            paddingHorizontal: dimensions.width * 0.03,
                            backgroundColor: selectedReflection.selectedSkinFeel === skinFeel ? '#005B41' : '#D2C780',
                            marginRight: dimensions.width * 0.03,
                            marginVertical: dimensions.height * 0.005,
                          }}>
                          <Text
                            style={{
                              fontSize: dimensions.width * 0.037,
                              color: 'white',
                              textAlign: 'center',
                              fontWeight: 400,
                              paddingHorizontal: dimensions.width * 0.026,
                              paddingVertical: dimensions.height * 0.016,

                            }}>
                            {skinFeel}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <Text
                      style={{
                        fontFamily: fontPoppinsRegular,
                        color: '#090814',
                        fontSize: dimensions.width * 0.037,
                        marginTop: dimensions.height * 0.019,
                        textDecorationLine: 'underline',
                        textAlign: 'left',
                        fontWeight: 400,
                      }}>
                      Any changes or concerns?
                    </Text>

                    <Text
                      style={{
                        fontFamily: fontPoppinsRegular,
                        color: '#090814',
                        fontSize: dimensions.width * 0.037,
                        marginTop: dimensions.height * 0.007,
                        textAlign: 'left',
                        fontWeight: 400,
                      }}>
                      {selectedReflection.changesOfConcerns}
                    </Text>

                    <Text
                      style={{
                        fontFamily: fontCormorantRegular,
                        color: '#090814',
                        fontSize: dimensions.width * 0.07,
                        marginTop: dimensions.height * 0.03,
                        marginBottom: dimensions.height * 0.01,
                        textAlign: 'left',
                        fontWeight: 600,
                      }}>
                      Hair Condition
                    </Text>


                    <View style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      width: '95%',
                      flexWrap: 'wrap',
                    }}>

                      {['Soft', 'Frizzy', 'Oily', 'Dry', 'Normal'].map((hairFeel, index) => (
                        <View
                          key={index} style={{
                            borderRadius: dimensions.width * 0.5,
                            paddingHorizontal: dimensions.width * 0.03,
                            backgroundColor: selectedReflection.selectedHairFeel === hairFeel ? '#005B41' : '#D2C780',
                            marginRight: dimensions.width * 0.03,
                            marginVertical: dimensions.height * 0.005,
                          }}>
                          <Text
                            style={{
                              fontSize: dimensions.width * 0.037,
                              color: 'white',
                              textAlign: 'center',
                              fontWeight: 400,
                              paddingHorizontal: dimensions.width * 0.026,
                              paddingVertical: dimensions.height * 0.016,

                            }}>
                            {hairFeel}
                          </Text>

                        </View>
                      ))}
                    </View>

                    <Text
                      style={{
                        fontFamily: fontPoppinsRegular,
                        color: '#090814',
                        fontSize: dimensions.width * 0.037,
                        marginTop: dimensions.height * 0.019,
                        textDecorationLine: 'underline',
                        textAlign: 'left',
                        fontWeight: 400,
                      }}>
                      Tried anything new?
                    </Text>

                    <Text
                      style={{
                        fontFamily: fontPoppinsRegular,
                        color: '#090814',
                        fontSize: dimensions.width * 0.037,
                        marginTop: dimensions.height * 0.007,
                        textAlign: 'left',
                        fontWeight: 400,
                      }}>
                      {selectedReflection.anythingNew}
                    </Text>

                    <Text
                      style={{
                        fontFamily: fontCormorantRegular,
                        color: '#090814',
                        fontSize: dimensions.width * 0.07,
                        marginTop: dimensions.height * 0.03,
                        textAlign: 'left',
                        fontWeight: 600,
                      }}>
                      Lifestyle & Habits
                    </Text>

                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                      <Text
                        style={{
                          fontFamily: fontPoppinsRegular,
                          color: '#090814',
                          fontSize: dimensions.width * 0.048,
                          marginTop: dimensions.height * 0.016,
                          textAlign: 'left',
                          fontWeight: 400,
                        }}>
                        {selectedReflection.glassesOfWater}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontPoppinsRegular,
                          color: '#090814',
                          fontSize: dimensions.width * 0.037,
                          marginTop: dimensions.height * 0.016,
                          textAlign: 'left',
                          fontWeight: 400,
                        }}>
                        {" "}glasses of water
                      </Text>

                    </View>

                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-start',
                      alignItems: 'center',
                    }}>
                      <Text
                        style={{
                          fontFamily: fontPoppinsRegular,
                          color: '#090814',
                          fontSize: dimensions.width * 0.048,
                          marginTop: dimensions.height * 0.01,
                          marginBottom: dimensions.height * 0.008,
                          textAlign: 'left',
                          fontWeight: 400,
                        }}>
                        {selectedReflection.hoursSleep}
                      </Text>
                      <Text
                        style={{
                          fontFamily: fontPoppinsRegular,
                          color: '#090814',
                          fontSize: dimensions.width * 0.037,
                          marginTop: dimensions.height * 0.01,
                          marginBottom: dimensions.height * 0.008,
                          textAlign: 'left',
                          fontWeight: 400,
                        }}>
                        {" "}hours of sleep
                      </Text>

                    </View>

                    {selectedReflection &&
                      selectedDay.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10) && (
                        <TouchableOpacity
                          onPress={() => {
                            // setIsEditindTodayRelfection(true);
                            editReflaction();
                          }}
                          style={{
                            backgroundColor: '#005B41',
                            borderRadius: dimensions.width * 0.5,
                            paddingVertical: dimensions.height * 0.019,
                            alignSelf: 'center',
                            width: dimensions.width * 0.9,
                            marginVertical: dimensions.height * 0.019,
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fontPoppinsRegular,
                              color: 'white',
                              fontSize: dimensions.width * 0.044,
                              textAlign: 'center',
                              fontWeight: 400,
                            }}
                          >
                            Edit
                          </Text>
                        </TouchableOpacity>
                      )}


                    <TouchableOpacity
                      onPress={() => {
                        setReflectionToDelete(selectedReflection);
                        setDeletingModalVisible(true);
                      }}
                      style={{
                        borderRadius: dimensions.width * 0.5,
                        alignSelf: 'center',
                        width: dimensions.width * 0.9,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: fontPoppinsRegular,
                          color: '#090814',
                          fontSize: dimensions.width * 0.04,
                          textDecorationLine: 'underline',
                          textAlign: 'center',
                          fontWeight: 400,
                        }}>
                        Delete
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    {!selectedReflection &&
                      selectedDay.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10) && (
                        <TouchableOpacity
                          onPress={() => {
                            setIsEditindTodayRelfection(true);
                          }}
                          style={{
                            backgroundColor: '#005B41',
                            borderRadius: dimensions.width * 0.5,
                            paddingVertical: dimensions.height * 0.019,
                            alignSelf: 'center',
                            width: dimensions.width * 0.9,
                            marginTop: dimensions.height * 0.03
                          }}
                        >
                          <Text
                            style={{
                              fontFamily: fontPoppinsRegular,
                              color: 'white',
                              fontSize: dimensions.width * 0.044,
                              textAlign: 'center',
                              fontWeight: 400,
                            }}
                          >
                            Add Today’s Reflection
                          </Text>
                        </TouchableOpacity>
                      )}
                  </>
                )}
              </View>
            </ScrollView>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false} ref={scrollViewReginasRef}>
              <View style={{
                paddingBottom: dimensions.height * 0.16,
                width: dimensions.width * 0.9,
                alignSelf: 'center',
              }}>
                <Text
                  style={{
                    fontFamily: fontCormorantRegular,
                    color: '#090814',
                    fontSize: dimensions.width * 0.07,
                    marginTop: dimensions.height * 0.03,
                    textAlign: 'left',
                    fontWeight: 600,
                  }}>
                  Mood & General Feeling
                </Text>

                <Text
                  style={{
                    fontFamily: fontPoppinsRegular,
                    color: '#090814',
                    fontSize: dimensions.width * 0.037,
                    marginTop: dimensions.height * 0.016,
                    textAlign: 'left',
                    fontWeight: 400,
                  }}>
                  How do you feel today?
                </Text>


                <TextInput
                  placeholder=""
                  value={feelToday}
                  onChangeText={setFeelToday}
                  style={{
                    marginTop: dimensions.height * 0.01,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#D2C780',
                    borderRadius: dimensions.width * 0.1,
                    width: dimensions.width * 0.9,
                    height: dimensions.height * 0.055,
                    alignSelf: 'center',
                    marginBottom: dimensions.height * 0.005,
                    fontFamily: fontPoppinsRegular,
                    fontSize: dimensions.width * 0.046,
                    fontWeight: 400,
                    textAlign: 'left',
                    color: 'white',
                    paddingHorizontal: dimensions.width * 0.05,
                  }}
                />


                <Text
                  style={{
                    fontFamily: fontCormorantRegular,
                    color: '#090814',
                    fontSize: dimensions.width * 0.07,
                    marginTop: dimensions.height * 0.03,
                    marginBottom: dimensions.height * 0.01,
                    textAlign: 'left',
                    fontWeight: 600,
                  }}>
                  Skin Condition
                </Text>



                <Text
                  style={{
                    fontFamily: fontPoppinsRegular,
                    color: '#090814',
                    fontSize: dimensions.width * 0.037,
                    marginTop: dimensions.height * 0.016,
                    textAlign: 'left',
                    fontWeight: 400,
                  }}>
                  How does your skin feel today?
                </Text>


                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '95%',
                  flexWrap: 'wrap',
                }}>

                  {['Hydrated', 'Dry', 'Oily', 'Sensitive', 'Normal'].map((skinFeel, index) => (
                    <TouchableOpacity
                      onPress={() => setSelectedSkinFeel(skinFeel)}
                      key={index} style={{
                        borderRadius: dimensions.width * 0.5,
                        paddingHorizontal: dimensions.width * 0.03,
                        backgroundColor: selectedSkinFeel === skinFeel ? '#005B41' : '#D2C780',
                        marginRight: dimensions.width * 0.03,
                        marginVertical: dimensions.height * 0.005,
                      }}>
                      <Text
                        style={{
                          fontSize: dimensions.width * 0.037,
                          color: 'white',
                          textAlign: 'center',
                          fontWeight: 400,
                          paddingHorizontal: dimensions.width * 0.026,
                          paddingVertical: dimensions.height * 0.016,

                        }}>
                        {skinFeel}
                      </Text>

                    </TouchableOpacity>
                  ))}
                </View>



                <Text
                  style={{
                    fontFamily: fontPoppinsRegular,
                    color: '#090814',
                    fontSize: dimensions.width * 0.037,
                    marginTop: dimensions.height * 0.016,
                    textAlign: 'left',
                    fontWeight: 400,
                  }}>
                  Any changes or concerns?
                </Text>

                <TextInput
                  placeholder=""
                  value={changesOfConcerns}
                  onChangeText={setChangesOfConcerns}
                  style={{
                    marginTop: dimensions.height * 0.01,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#D2C780',
                    borderRadius: dimensions.width * 0.1,
                    width: dimensions.width * 0.9,
                    height: dimensions.height * 0.055,
                    alignSelf: 'center',
                    marginBottom: dimensions.height * 0.005,
                    fontFamily: fontPoppinsRegular,
                    fontSize: dimensions.width * 0.046,
                    fontWeight: 400,
                    color: 'white',
                    textAlign: 'left',
                    paddingHorizontal: dimensions.width * 0.05,
                  }}
                />




                <Text
                  style={{
                    fontFamily: fontCormorantRegular,
                    color: '#090814',
                    fontSize: dimensions.width * 0.07,
                    marginTop: dimensions.height * 0.03,
                    marginBottom: dimensions.height * 0.01,
                    textAlign: 'left',
                    fontWeight: 600,
                  }}>
                  Hair Condition
                </Text>



                <Text
                  style={{
                    fontFamily: fontPoppinsRegular,
                    color: '#090814',
                    fontSize: dimensions.width * 0.037,
                    marginTop: dimensions.height * 0.016,
                    textAlign: 'left',
                    fontWeight: 400,
                  }}>
                  How does your hair feel today?
                </Text>


                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '95%',
                  flexWrap: 'wrap',
                }}>

                  {['Soft', 'Frizzy', 'Oily', 'Dry', 'Normal'].map((hairFeel, index) => (
                    <TouchableOpacity
                      onPress={() => setSelectedHairFeel(hairFeel)}
                      key={index} style={{
                        borderRadius: dimensions.width * 0.5,
                        paddingHorizontal: dimensions.width * 0.03,
                        backgroundColor: selectedHairFeel === hairFeel ? '#005B41' : '#D2C780',
                        marginRight: dimensions.width * 0.03,
                        marginVertical: dimensions.height * 0.005,
                      }}>
                      <Text
                        style={{
                          fontSize: dimensions.width * 0.037,
                          color: 'white',
                          textAlign: 'center',
                          fontWeight: 400,
                          paddingHorizontal: dimensions.width * 0.026,
                          paddingVertical: dimensions.height * 0.016,

                        }}>
                        {hairFeel}
                      </Text>

                    </TouchableOpacity>
                  ))}
                </View>



                <Text
                  style={{
                    fontFamily: fontPoppinsRegular,
                    color: '#090814',
                    fontSize: dimensions.width * 0.037,
                    marginTop: dimensions.height * 0.016,
                    textAlign: 'left',
                    fontWeight: 400,
                  }}>
                  Tried anything new?
                </Text>

                <TextInput
                  placeholder=""
                  value={anythingNew}
                  onChangeText={setAnythingNew}
                  style={{
                    marginTop: dimensions.height * 0.01,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backgroundColor: '#D2C780',
                    borderRadius: dimensions.width * 0.1,
                    width: dimensions.width * 0.9,
                    height: dimensions.height * 0.055,
                    alignSelf: 'center',
                    marginBottom: dimensions.height * 0.005,
                    fontFamily: fontPoppinsRegular,
                    fontSize: dimensions.width * 0.046,
                    fontWeight: 400,
                    color: 'white',
                    textAlign: 'left',
                    paddingHorizontal: dimensions.width * 0.05,
                  }}
                />




                <Text
                  style={{
                    fontFamily: fontCormorantRegular,
                    color: '#090814',
                    fontSize: dimensions.width * 0.07,
                    marginTop: dimensions.height * 0.03,
                    textAlign: 'left',
                    fontWeight: 600,
                  }}>
                  Lifestyle & Habits
                </Text>



                <Text
                  style={{
                    fontFamily: fontPoppinsRegular,
                    color: '#090814',
                    fontSize: dimensions.width * 0.037,
                    marginTop: dimensions.height * 0.016,
                    marginBottom: dimensions.height * 0.008,
                    textAlign: 'left',
                    fontWeight: 400,
                  }}>
                  How many glasses of water did you drink today?
                </Text>


                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#D2C780',
                  borderRadius: dimensions.width * 0.1,
                  width: dimensions.width * 0.9,
                  height: dimensions.height * 0.055,
                  alignSelf: 'center',
                  marginBottom: dimensions.height * 0.005,
                  paddingHorizontal: dimensions.width * 0.05,
                }}>
                  <Text
                    style={{
                      fontFamily: fontPoppinsRegular,
                      color: 'white',
                      fontSize: dimensions.width * 0.043,
                      textAlign: 'left',
                      fontWeight: 400,
                    }}>
                    {glassesOfWater}
                  </Text>


                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <TouchableOpacity
                      onPress={() => setGlassesOfWater((prev) => prev + 1)}
                      disabled={glassesOfWater === 20}
                      style={{
                        backgroundColor: '#005B41',
                        borderRadius: dimensions.width * 0.5,
                        height: dimensions.height * 0.04,
                        width: dimensions.height * 0.04,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{
                        color: 'white',
                        fontSize: dimensions.width * 0.05,
                      }}>
                        +
                      </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                      onPress={() => setGlassesOfWater((prev) => prev - 1)}
                      disabled={glassesOfWater === 0}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.5,
                        height: dimensions.height * 0.04,
                        width: dimensions.height * 0.04,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: dimensions.width * 0.02,
                      }}>
                      <Text style={{
                        color: '#005B41',
                        fontSize: dimensions.width * 0.05,
                      }}>
                        -
                      </Text>
                    </TouchableOpacity>

                  </View>

                </View>


                <Text
                  style={{
                    fontFamily: fontPoppinsRegular,
                    color: '#090814',
                    fontSize: dimensions.width * 0.037,
                    marginTop: dimensions.height * 0.016,
                    marginBottom: dimensions.height * 0.008,
                    textAlign: 'left',
                    fontWeight: 400,
                  }}>
                  How many hours did you sleep?
                </Text>

                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#D2C780',
                  borderRadius: dimensions.width * 0.1,
                  width: dimensions.width * 0.9,
                  height: dimensions.height * 0.055,
                  alignSelf: 'center',
                  marginBottom: dimensions.height * 0.005,
                  paddingHorizontal: dimensions.width * 0.05,
                }}>
                  <Text
                    style={{
                      fontFamily: fontPoppinsRegular,
                      color: 'white',
                      fontSize: dimensions.width * 0.043,
                      textAlign: 'left',
                      fontWeight: 400,
                    }}>
                    {hoursSleep}
                  </Text>


                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <TouchableOpacity
                      onPress={() => setHoursSleep((prev) => prev + 1)}
                      disabled={hoursSleep === 23}
                      style={{
                        backgroundColor: '#005B41',
                        borderRadius: dimensions.width * 0.5,
                        height: dimensions.height * 0.04,
                        width: dimensions.height * 0.04,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Text style={{
                        color: 'white',
                        fontSize: dimensions.width * 0.05,
                      }}>
                        +
                      </Text>
                    </TouchableOpacity>


                    <TouchableOpacity
                      onPress={() => setHoursSleep((prev) => prev - 1)}
                      disabled={hoursSleep === 1}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: dimensions.width * 0.5,
                        height: dimensions.height * 0.04,
                        width: dimensions.height * 0.04,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginLeft: dimensions.width * 0.02,
                      }}>
                      <Text style={{
                        color: '#005B41',
                        fontSize: dimensions.width * 0.05,
                      }}>
                        -
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>


                <TouchableOpacity
                  onPress={handleSaveTodayReflection}
                  disabled={feelToday === '' || selectedSkinFeel === '' || selectedHairFeel === '' || changesOfConcerns === '' || anythingNew === ''}
                  style={{
                    backgroundColor: feelToday === '' || selectedSkinFeel === '' || selectedHairFeel === '' || changesOfConcerns === '' || anythingNew === '' ? '#c0beb5' : '#005B41',
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
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}

        </>
      ) : (
        <>
          <CalendarScreen setIsCalendarVisible={setIsCalendarVisible} setIsEditindTodayRelfection={setIsEditindTodayRelfection} />
        </>
      )}





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
              Unsaved Changes
            </Text>
            <Text style={{
              paddingHorizontal: dimensions.width * 0.073,
              textAlign: 'center',
              fontFamily: fontPoppinsRegular,
              fontSize: dimensions.width * 0.034,
              marginBottom: dimensions.height * 0.019,
            }}>
              You have unsaved changes. Do you want to save before leaving?
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
                  setIsEditindTodayRelfection(false);
                  setAnythingNew('');
                  setChangesOfConcerns('');
                  setFeelToday('');
                  setGlassesOfWater(0);
                  setHoursSleep(0);
                  setSelectedHairFeel('');
                  setSelectedSkinFeel('');
                }}
              >
                <Text style={{
                  color: 'black',
                  textAlign: 'center',
                  fontFamily: fontPoppinsRegular,
                  fontSize: dimensions.width * 0.043,
                  alignSelf: 'center',
                  fontWeight: 600,
                  color: '#005B41'
                }}>
                  Delete
                </Text>
              </TouchableOpacity>

            </View>
          </View>
        </View>
      </Modal>



      <Modal
        animationType="fade"
        transparent={true}
        visible={deletingModalVisible}
        onRequestClose={() => {
          setDeletingModalVisible(!deletingModalVisible);
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
              Delete Entry?
            </Text>
            <Text style={{
              paddingHorizontal: dimensions.width * 0.073,
              textAlign: 'center',
              fontFamily: fontPoppinsRegular,
              fontSize: dimensions.width * 0.034,
              marginBottom: dimensions.height * 0.019,
            }}>
              Are you sure you want to delete this entry? This action cannot be undone
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
                  setDeletingModalVisible(false);
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
                  setDeletingModalVisible(false);
                  handleDeleteTodayReflaction(reflectionToDelete.id)
                }}
              >
                <Text style={{
                  color: 'black',
                  textAlign: 'center',
                  fontFamily: fontPoppinsRegular,
                  fontSize: dimensions.width * 0.043,
                  alignSelf: 'center',
                  fontWeight: 600,
                  color: '#FF3B30'
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

export default JournalScreen;
