import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';


const fontPoppinsRegular = 'Poppins-Regular';
const fontCormorantRegular = 'Cormorant-Regular';

const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const formatBubbleHeaderDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

const CalendarScreen = ({ setIsCalendarVisible, setIsEditindTodayRelfection }) => {
  const [dimensions, setDimensions] = useState(Dimensions.get('window'));
  const [selectedDate, setSelectedDate] = useState(formatDate(new Date()));
  const [today, setToday] = useState(formatDate(new Date()));

  const [selectedReflection, setSelectedReflection] = useState(null);

  useEffect(() => {
    const loadReflectionForSelectedDate = async () => {
      try {
        const storedReflections = await AsyncStorage.getItem('reflactions');
        if (storedReflections) {
          const reflectionsArray = JSON.parse(storedReflections);
          const reflectionForDate = reflectionsArray.find(
            (item) =>
              new Date(item.saveDate).toISOString().slice(0, 10) === selectedDate
          );
          setSelectedReflection(reflectionForDate || null);
        } else {
          setSelectedReflection(null);
        }
      } catch (error) {
        console.error('Error loading reflection for selected date:', error);
      }
    };
    loadReflectionForSelectedDate();
  }, [selectedDate]);


  useEffect(() => {
    const scheduleMidnightReset = () => {
      const now = new Date();
      const nextMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const timeout = nextMidnight - now;
      const timer = setTimeout(() => {
        scheduleMidnightReset();
      }, timeout);
      return () => clearTimeout(timer);
    };

    const cleanup = scheduleMidnightReset();
    return cleanup;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentToday = formatDate(new Date());
      if (currentToday !== today) {
        setToday(currentToday);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [today]);

  const markedDates = useMemo(() => {
    const marks = {
      [today]: {
        selected: selectedDate === today,
        selectedColor: '#005B41',
        textColor: 'white',
      },
    };

    if (selectedDate && selectedDate !== today) {
      marks[selectedDate] = {
        ...(marks[selectedDate] || {}),
        selected: true,
        selectedColor: '#005B41',
        textColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
      };
    }

    return marks;
  }, [today, selectedDate]);

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
  };

  return (
    <SafeAreaView style={{
      width: dimensions.width,
      flex: 1,
      alignItems: 'center',
      justifyContent: 'flex-start',
      position: 'relative',
    }} >
      <View style={{ width: '100%', flex: 1, paddingHorizontal: 4 }}>
        <View
          style={{
            width: '100%',
            alignSelf: 'center',
            marginBottom: dimensions.height * 0.01,
          }}
        >
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
        >
          <View style={{ marginBottom: dimensions.height * 0.25 }}>
            <Calendar
              onDayPress={handleDayPress}
              markedDates={markedDates}
              theme={{
                backgroundColor: 'transparent',
                calendarBackground: 'transparent',
                textSectionTitleColor: 'white',
                selectedDayBackgroundColor: '#005B41',
                selectedDayTextColor: 'white',
                todayTextColor: '#005B41',
                dayTextColor: 'white',
                textDisabledColor: 'rgba(255, 255, 255, 0.5)',
                dotColor: '#005B41',
                selectedDotColor: '#005B41',
                arrowColor: '#005B41',
                monthTextColor: 'white',
                indicatorColor: '#005B41',
                textDayFontFamily: 'SFPro-Bold',
                textMonthFontFamily: 'SFPro-Medium',
                textDayHeaderFontFamily: 'SFPro-Medium',
                textDayFontSize: dimensions.width * 0.043,
                textDayStyle: {
                  fontFamily: fontPoppinsRegular,
                  fontWeight: 500
                },
                textMonthStyle: {
                  fontFamily: fontPoppinsRegular,
                  fontWeight: 500
                },
                textMonthFontSize: dimensions.width * 0.043,
                textDayHeaderFontSize: dimensions.width * 0.037,
              }}
              renderHeader={(date) => {
                return (
                  <View style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                    <Text
                      style={{
                        fontFamily: fontPoppinsRegular,
                        fontSize: dimensions.width * 0.046,
                        color: 'white',
                        textAlign: 'center',
                      }}
                    >{formatBubbleHeaderDate(date)}</Text>
                  </View>
                );
              }}
              style={{
                borderWidth: 0,
                width: dimensions.width * 0.91,
                alignSelf: 'center',
                borderRadius: dimensions.width * 0.043,
                backgroundColor: '#D2C780',
                paddingBottom: dimensions.height * 0.019,
                paddingTop: dimensions.width * 0.01,
                marginHorizontal: -dimensions.width * 0.04
              }}
            />
            <View style={{
              marginTop: dimensions.height * 0.019,
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
                  day: date.getDate(),
                  dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'short' }),
                };
              }).reverse().map((dateObj, index, arr) => (
                <View
                  key={index}
                  style={{
                    backgroundColor: index === arr.length - 1 ? '#005B41' : '#D2C780',
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
                </View>
              ))}
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
                paddingHorizontal: dimensions.width * 0.05,
              }}
            >
              Track your daily skin, hair & wellness journey
            </Text>

            {selectedReflection && (
              <View style={{
                alignSelf: 'center',
                width: dimensions.width * 0.9
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
                      key={index}
                      style={{
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
                      key={index}
                      style={{
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
              </View>
            )}

            {selectedDate === formatDate(new Date()) && !selectedReflection && (
              <TouchableOpacity
                onPress={() => {
                  setIsCalendarVisible(false);
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
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default CalendarScreen;
