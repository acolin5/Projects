import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, query, orderByChild, equalTo, get } from "firebase/database";
//import { Button } from 'react-native';
import { router } from 'expo-router';
import { Button, Card} from '@rneui/themed';

const navigateToHomePage = () => {
    router.push('/'); 
};

const LoginScreen = () => {
    const [companyId, setCompanyId] = useState('');
    const [userId, setUserId] = useState(''); 
    const [password, setPassword] = useState('');
  
    const auth = getAuth();
    const database = getDatabase();
  
    const handleLogin = async () => {
        try {
          if (companyId.trim() === '' || userId.trim() === '' || password.trim() === '') {
            Alert.alert('Error', 'Please provide company ID, user ID, and password');
            return;
          }
      
          // Query database for matching user
          const userRef = ref(database, '/users');
          const userQuery = query(userRef, orderByChild('companyId_adminId'), equalTo(companyId + '_' + userId));
          const snapshot = await get(userQuery);
          
          if (snapshot.exists()) {
            const users = snapshot.val();
            const user = Object.values(users)[0];
      
            
            if (user.password === password) {
              console.log('Successfully logged in:', user);
      
              if (user.userType === 'Admin') {
                router.push('/adminPage');
              } else if (user.userType === 'Employee') {
                router.push('/employeePage');
              } else {
                Alert.alert('Error', 'Invalid user type');
              }
            } else {
              Alert.alert('Error', 'Invalid password');
            }
          } else {
            Alert.alert('Error', 'User not found');
          }
        } catch (error) {
          console.error('Error during login:', error);
          Alert.alert('Error', 'Login Failed: ' + error.message);
        }
      };
      
      

  return (
    <View style={styles.container}>
              <View style={styles.contentContainer}>
              <View style={styles.topBar}>
      <Text h4 style={styles.logo}>TimeOn</Text>
      <View style={styles.buttonsContainer}>
        <Button
          title="Log In"
          onPress={() => {router.push('/login')}}
          containerStyle={{ marginHorizontal: 5 }}
          buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />
        <Button
          title="Sign Up"
          onPress={() => {router.push('/register'); }}
          containerStyle={{ marginHorizontal: 5 }}
          buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />
          <Button
          title="TimeOn"
          onPress={() => {router.push('')}}
          containerStyle={{ marginHorizontal: 5 }}
          buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />
        <Button
          title="Contacts"
          onPress={() => {router.push('/contact'); }}
          containerStyle={{ marginHorizontal: 5 }}
          buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />
          </View>
        </View>
      </View>
      <View style={styles.imgContainer}>
        <Image
          source={require('../assets/timeonlogooriginal.jpeg')}
          style={styles.avatar}
        />
        <Text style={styles.title}>TimeOn</Text>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Company ID"
        value={companyId}
        onChangeText={setCompanyId}
      />
      <TextInput
        style={styles.input}
        placeholder="Admin ID / Employee ID"
        value={userId}
        onChangeText={setUserId}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
  },
  logo: {
    fontSize: 24,
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  homeButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    padding: 10,
    backgroundColor: '#04AA6D',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  imgContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  input: {
    width: '100%',
    padding: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#04AA6D',
    padding: 14,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
    contentContainer: {
    flex: 0.2,
    width: '70%', // occupies 90% of the screen width
    alignSelf: 'center',
    paddingHorizontal: 20,
  },
buttonText: {
    color: 'white', 
    fontSize: 16
},
buttonsContainer: {
  flexDirection: 'row'
},
buttonText: {
  color: 'white', 
  fontSize: 16
},
header: {
  backgroundColor: '#e0e0e0',
  padding: 0,
},
headerText: {
  fontSize: 16,
  fontWeight: 'bold',
  textAlign: 'center',
},
});

export default LoginScreen;
