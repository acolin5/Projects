import React, { useState } from 'react';
import { router } from 'expo-router';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, query, orderByChild, equalTo, get } from "firebase/database";
import { Picker } from 'react-native';


import { Button, Card} from '@rneui/themed';
const TaskScreen = () => {
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  
  const auth = getAuth();
  const database = getDatabase();

  const handleSaveTask = async () => {
    try {
      const taskData = {
        taskName,
        taskDescription
      };
      
    let taskSave = new Boolean(true);
    if (taskName === '') 
    {
      document.getElementById("tNameError").style.display = 'inline-block';
      saveTask = false;
    }
    if (taskDescription === '') 
    {
      document.getElementById("tDescError").style.display = 'inline-block';
      saveTask = false;
    }

    if (taskSave) {
      createTask(taskName, taskDescription);
      //set(ref(database, 'users/' + auth.currentUser.uid), userData);
    }

    Alert.alert('Success', 'Registration Successful');
      // Navigate to the next page if needed
    } catch (error) {
      console.error('Error during registration:', error);
      Alert.alert('Error', 'Registration Failed: ' + error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
              <View style={styles.contentContainer}>
              <View style={styles.topBar}>
      <Text h4 style={styles.logo}>TimeOn</Text>
      <View style={styles.buttonsContainer}>
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
    </View>
              </View>
      <View style={styles.imgcontainer}>
        <Image source={{ uri: 'https://cdn.glitch.global/1c8d8485-d588-4c98-aa36-65523065f7c6/thumbnails%2Fideogram%20(7).jpeg?1695770167340' }} style={styles.avatar} />
        <Text style={styles.title}>TimeOn</Text>
      </View>
      
      <View style={styles.formContainer}>
      <Text h4 style={styles.PageTitle}>Create New Task</Text>
      <br></br>
      <br></br>
        <label for="tName">Task Name</label>
         <TextInput
           id="tName"
           style={styles.smallInput}
           placeholder="Enter Task Name"
           value={taskName}
           onChangeText={(text) => setTaskName(text)}
         />
         <View style={styles.errorText} id="tNameError">
           <Text>Please give a name for the task</Text>
         </View>

         <label for="tDesc">Task Description</label>
         <TextInput
           id="tDesc"
           style={styles.input}
           multiline={true}
           numberOfLines={10}
           placeholder="Enter Task Description"
           value={taskDescription}
           onChangeText={(text) => setTaskDescription(text)}
         />
         <View style={styles.errorText} id="tDescError">
           <Text>Please give a name for the task</Text>
         </View>
            <TouchableOpacity style={styles.button} onPress={handleSaveTask}>
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
  PageTitle: {
    fontSize: 36,
    color: 'black',
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

export default TaskScreen;