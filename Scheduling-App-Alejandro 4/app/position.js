import React, { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { getAuth, createNewPosition } from "firebase/auth";
import { getDatabase, ref, set, onValue, off } from "firebase/database";
import { Picker } from 'react-native';
import { Button, Card} from '@rneui/themed';

const PositionScreen = () => {
    const [positionName, setPositionName] = useState('');
    const [locationNames, setLocationNames] = useState('');
    const [taskNames, setTaskNames] = useState('');
    const [positionDescription, setPositionDesc] = useState('');
    const [locations, setLocations] = useState([]);
    const [positionError, setPositionError] = useState(false);
    const [locationError, setLocationError] = useState(false);
    const [taskError, setTaskError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [data, setData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalVisible, setModalVisible] = useState(false);

    const auth = getAuth();
    const database = getDatabase();

    useEffect(() => {
        const db = getDatabase();
        const locationsRef = ref(db, 'locations');
        onValue(locationsRef, (snapshot) => {
            const locationData = snapshot.val();
            if (locationData) {
                const locationArray = Object.keys(locationData).map((key) => {
                    return { id: key, name: locationData[key].name }; // Assuming each location has a 'name' field
                });
                setLocations(locationArray);
            } else {
                setLocations([]); // Clear locations if none found
            }
        });

        return () => {
            off(locationsRef); // Detach the listener
        };
    }, []);

  const handleLinkChange = (itemValue) => {
    setSelectedLink(itemValue);
    if (itemValue) {
        router.push(itemValue);
      }
  };

  const handleLocationChange = (itemValue) => {
    setLocationNames(itemValue);
  };

  const handleTaskChange = (itemValue) => {
    setTaskNames(itemValue);
  };


  const handleSaveLocation = async () => {
    // Resetting the error states
    let positionSave = true;
    setPositionError(false);
    setLocationError(false);
    setTaskError(false);
    setDescriptionError(false);

    // Validation checks
    if (positionName === '') {
        setPositionError(true);
        positionSave = false;
    }
    if (locationNames.length === 0) {
        setLocationError(true);
        positionSave = false;
    }
    {/*if (taskNames.length === 0) {
        setTaskError(true);
        positionSave = false;
    }*/}

    if (positionDescription === '') {
        setDescriptionError(true);
        positionSave = false;
    }

    // If all validations pass
    if (positionSave) {
        try {
            const selectedLocation = locations.find(loc => loc.id === locationNames);
            const locationNameToSave = selectedLocation ? selectedLocation.name : '';

            const positionData = {
                positionName,
                locationName: locationNameToSave, // Save the location name
                //taskNames,
                positionDescription,
            };
            console.log('Position Data being saved: ', positionData); // Debug log
            
            // Saving the position data to Firebase
            await set(ref(database, 'positions/' + positionName), positionData); 
            
            Alert.alert('Success', 'Position saved successfully');
            // Reset form state here if necessary
        } catch (error) {
            console.error('Error:', error);
            Alert.alert('Error', 'Failed to save position: ' + error.message);
        }
    }
};


  return (
<ScrollView style={styles.container}>
            <View style={styles.contentContainer}>
                <View style={styles.topBar}>
                    <Text style={styles.logo}>TimeOn</Text>
                    <Button title="Home" onPress={() => {router.push('/adminPage')}}           
                    containerStyle={{ marginHorizontal: 5 }}
                    buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />
                    <Button title="New Task" onPress={() => {router.push('/task')}}
                                        containerStyle={{ marginHorizontal: 5 }}
                                        buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />
                    <Button title="New Location" onPress={() => {router.push('/newLocation')}}
                                        containerStyle={{ marginHorizontal: 5 }}
                                        buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />
                    <Button title="Logout" onPress={() => {router.push('/login')}}
                                        containerStyle={{ marginHorizontal: 5 }}
                                        buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />
                </View>
            </View>

            <View style={styles.imgcontainer}>
                <Image
                    source={{ uri: 'https://cdn.glitch.global/1c8d8485-d588-4c98-aa36-65523065f7c6/thumbnails%2Fideogram%20(7).jpeg?1695770167340' }}
                    style={styles.avatar}
                />
                <Text style={styles.title}>TimeOn</Text>
            </View>
      
            <View style={styles.formContainer}>
                <Text style={styles.pageTitle}>Create New Position</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Position Title"
                        value={positionName}
                        onChangeText={setPositionName}
                    />
                    <Picker
                        selectedValue={locationNames}
                        style={styles.picker}
                        onValueChange={handleLocationChange}>
                        <Picker.Item label="Select a Location" value="" />
                        {locations.map((location) => (
                            <Picker.Item label={location.name} value={location.id} key={location.id} />
                        ))}
                    </Picker>
                    {/* Error messages */}
                    {positionError && <Text style={styles.errorText}>Please give a title for the position</Text>}
                    {locationError && <Text style={styles.errorText}>Please select at least 1 location</Text>}
                </View>

                <Text style={styles.labelHori}>Position Description</Text>
                <TextInput
                    style={styles.input}
                    multiline={true}
                    numberOfLines={10}
                    placeholder="Enter description"
                    value={positionDescription}
                    onChangeText={(text) => setPositionDesc(text)}
                />

                <TouchableOpacity style={styles.button} onPress={handleSaveLocation}>
                    <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    width: '70%', // occupies 90% of the screen width
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
    borderRadius: 20,
    margin: 10,
    overflow: 'hidden'
  },
  logo: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  buttonsContainer: {
    flexDirection: 'row'
  },
  imgcontainer: {
    alignItems: 'center',
    marginVertical: 24,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  formContainer: {
    padding: 16,
  },
  headerContainer: {
    alignItems: 'center',
    paddingVertical: 20,
},
avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
},
title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
},
formContainer: {
    padding: 20,
},
pageTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
},
  PageTitle: {
    fontSize: 36,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 10,
  },
inputContainer: {
    marginBottom: 20,
},
input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    fontSize: 18,
},
picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 5,
},
descriptionInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 18,
    height: 100, // Adjust the height as needed
    textAlignVertical: 'top',
},
saveButton: {
    backgroundColor: '#04AA6D',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginTop: 20,
},
saveButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
},
  formContainer: {
    padding: 16,
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  smallInput: {
    width: 250,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  inputHori: {
    width: 200,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  smallInputHori: {
    marginHorizontal: 10,
    width: 100,
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  labelHori: {
    fontSize: 20,
    marginRight: 100,
    width: 200,
    marginVertical: 1,
  },
  smallLabelHori: {
    marginRight: 95,
    width: 200,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  divHori: {
    flexDirection: 'row',
    marginTop: 20
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  button: {
    backgroundColor: '#04AA6D',
    padding: 14,
    marginVertical: 8,
    width: 100,
    alignItems: 'center',
    borderRadius: 5,
  },
  roundedButton: {
    borderRadius: 25,
    backgroundColor: '#007BFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dropdownContainer: {
    marginVertical: 8,
  },
  optiontext: {
    fontSize: 20,
  },
  pickerContainer: {
    marginVertical: 8,
  },
  picker: {
    width: '100%',
  },
  dropbtn: {
    backgroundColor: '#3498DB',
    padding: 14,
    alignItems: 'center',
    borderRadius: 5,
  },
  errorText: {
    color: 'red', // Text color for error messages
    fontSize: 14,   // Font size for error messages
    display: 'none', // Hide error text by default
  },
  show: {
    color: 'red', // Text color for error messages
    fontSize: 14,   // Font size for error messages
    display: 'inline-block',

  },
});

export default PositionScreen;