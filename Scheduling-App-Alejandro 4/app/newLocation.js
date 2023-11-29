import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { getAuth, createNewLocation } from "firebase/auth";
import { getDatabase, ref, set, push, query, orderByChild, equalTo, get } from "firebase/database";
import { Picker } from 'react-native';
import { Button, Card} from '@rneui/themed';

const LocationsScreen = () => {
  const [locationName, setLocationName] = useState('');
  const [locationAddress, setLocationAddress] = useState('');
  const [locationAddress2, setLocationAddress2] = useState('');
  const [locationCity, setLocationCity] = useState('');
  const [locationState, setLocationState] = useState('');
  const [locationZIP, setLocationZIP] = useState('');
  
  const auth = getAuth();
  const database = getDatabase();

  const navigateToAdminPage = () => {
    router.push('/adminPage'); // Navigate to adminPage.js
  };

  const navigateToIndex = () => {
    router.push('/'); // Navigate to index.js
  };
  const navigatetoEmployeeList = () => {
    router.push('/employeeList'); 
  };

  const handleSaveLocation = async () => {
    if (!locationName || !locationAddress || !locationCity || !locationState || !locationZIP) {
      Alert.alert('Error', 'Please fill all the required fields.');
      return;
    }

    try {
      // Generate a new location key
      const newLocationRef = push(ref(database, 'locations'));

      const locationData = {
        name: locationName,
        address: locationAddress,
        address2: locationAddress2,
        city: locationCity,
        state: locationState,
        zip: locationZIP,
        createdBy: auth.currentUser.uid
      };

      // Save the location data
      await set(newLocationRef, locationData);

      Alert.alert('Success', 'Location saved successfully');
      // Clear the form or navigate as needed
    } catch (error) {
      console.error('Error during location saving:', error);
      Alert.alert('Error', 'Failed to save location: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
     <View style={styles.topBar}>
        <Button
          title="Home"
          onPress={() => {router.push('/adminPage')}}
          containerStyle={{ marginHorizontal: 5 }}
          buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />
        <Button
          title="New Task"
          onPress={() => {router.push('/task'); }}
          containerStyle={{ marginHorizontal: 5 }}
          buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />
        <Button
          title="New Location"
          onPress={() => {router.push('/newLocation'); }}
          containerStyle={{ marginHorizontal: 5 }}
          buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />
        <Button
          title="Logout"
          onPress={() => {router.push('/'); }}
          containerStyle={{ marginHorizontal: 5 }}
          buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />

      </View>
      <View style={styles.imgcontainer}>
        <Image source={{ uri: 'https://cdn.glitch.global/1c8d8485-d588-4c98-aa36-65523065f7c6/thumbnails%2Fideogram%20(7).jpeg?1695770167340' }} style={styles.avatar} />
        <Text style={styles.title}>TimeOn</Text>
      </View>
      
      <View style={styles.formContainer}>
      <Text h4 style={styles.PageTitle}>Create New Location</Text>
      <br></br>
      <br></br>
        <label for="lName">Location Name</label>
         <TextInput
           id="lName"
           style={styles.smallInput}
           placeholder="Enter Location Name"
           value={locationName}
           onChangeText={(text) => setLocationName(text)}
         />
         <View style={styles.errorText} id="lNameError">
           <Text>Please give a name for the location</Text>
         </View>
          <div style={styles.divHori}>
         <label for="lAdd" style={styles.labelHori}>Location Address</label>
         <label for="lAddCity" style={styles.smallLabelHori}>City</label>
         <label for="lAddState" style={styles.smallLabelHori}>State</label>
         <label for="lAddZip" style={styles.smallLabelHori}>Zip</label>
         <br></br>
         <TextInput
           id="lAdd"
           style={styles.inputHori}
           placeholder="Enter location address"
           value={locationAddress}
           onChangeText={(text) => setLocationAddress(text)}
         />
         <TextInput
           id="lAddCity"
           style={styles.smallInputHori}
           placeholder="City"
           value={locationCity}
           onChangeText={(text) => setLocationCity(text)}
         />
         <TextInput
           id="lAddState"
           style={styles.smallInputHori}
           placeholder="State"
           value={locationState}
           onChangeText={(text) => setLocationState(text)}
         />
         <TextInput
           id="lAddZip"
           style={styles.smallInputHori}
           placeholder="Postal Code"
           value={locationZIP}
           onChangeText={(text) => setLocationZIP(text)}
         />
         <br></br>
         <View style={styles.errorText} id="lAddError">
           <Text>Please fill out the full address</Text>
         </View>
         </div>
         <br></br>
         <label for="lAdd2" style={styles.labelHori}>Location Address 2</label>
         <TextInput
           id="lAdd2"
           style={styles.inputHori}
           placeholder="Enter location address"
           value={locationAddress2}
           onChangeText={(text) => setLocationAddress2(text)}
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
  buttonText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: '#ff0000',
  },
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  roundedButton: {
    borderRadius: 25,
    backgroundColor: '#50C878',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  logo: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  PageTitle: {
    fontSize: 36,
    color: 'black',
    fontWeight: 'bold',
    marginLeft: 10,
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  roundedButton: {
    borderRadius: 25,
    backgroundColor: '#007BFF',
    paddingHorizontal: 15,
    paddingVertical: 10,
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
    color: 'red', 
    fontSize: 14,   
    display: 'none',
  },
  show: {
    color: 'red', 
    fontSize: 14,  
    display: 'inline-block',

  },
});

export default LocationsScreen;