import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert, Image } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getDatabase, ref, set, query, orderByChild, equalTo, get } from "firebase/database";
import { Picker } from 'react-native';
import { router } from 'expo-router';
import { Button, Card } from '@rneui/themed';


const RegisterScreen = () => {
  const [userType, setUserType] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [ssn, setSSN] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [adminId, setAdminId] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [securityQuestion1, setSecurityQuestion1] = useState('');
  const [securityQuestion2, setSecurityQuestion2] = useState('');
  const [securityAnswer1, setSecurityAnswer1] = useState('');
  const [securityAnswer2, setSecurityAnswer2] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('initial'); // Added verificationStatus state

  const auth = getAuth();
  const database = getDatabase();

  const navigateToHomePage = () => {
    router.push('/');
  };

  const formatSSN = (text) => {
    const digitsOnly = text.replace(/\D/g, '');
    if (digitsOnly.length <= 3) return digitsOnly;
    if (digitsOnly.length <= 5) return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3)}`;
    return `${digitsOnly.slice(0, 3)}-${digitsOnly.slice(3, 5)}-${digitsOnly.slice(5, 9)}`;
  };

  const handleVerification = async () => {
    try {
      const queryValue = `${companyId}_${ssn.replace(/-/g, '')}`;
      const usersRef = query(ref(database, 'users'), orderByChild('companyId_ssn'), equalTo(queryValue));
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        // User found in database
        Alert.alert('Error', 'Employee already registered.');
        setVerificationStatus('red'); // Set verification status to 'red'
      } else {
        // User not found in database
        setVerificationStatus('green'); // Set verification status to 'green'
      }
    } catch (error) {
      console.error('Error during verification:', error);
      Alert.alert('Error', 'Verification Failed: ' + error.message);
    }
  };
  const handleGoHome = () => {
    router.push('/');
  };

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const userData = {
        userType,
        firstName,
        lastName,
        ssn,
        companyId,
        companyId_ssn: `${companyId}_${ssn.replace(/-/g, '')}`,
        companyId_adminId: `${companyId}_${adminId}`,  // Updated this line
        companyId_adminId_password: `${companyId}_${adminId}_${password}`, // Updated this line
        companyId_employeeId_password: `${companyId}_${employeeId}_${password}`, // Updated this line
        email,
        adminId,
        employeeId,
        securityAnswer1,
        securityAnswer2,
        password
      };
      await set(ref(database, 'users/' + auth.currentUser.uid), userData);
      Alert.alert('Success', 'Registration Successful');
      router.push('/');
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
              title="Log In"
              onPress={() => { router.push('/login') }}
              containerStyle={{ marginHorizontal: 5 }}
              buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />
            <Button
              title="Sign Up"
              onPress={() => { router.push('/register'); }}
              containerStyle={{ marginHorizontal: 5 }}
              buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />
            <Button
              title="TimeOn"
              onPress={() => { router.push('') }}
              containerStyle={{ marginHorizontal: 5 }}
              buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />
            <Button
              title="Contacts"
              onPress={() => { router.push('/contact'); }}
              containerStyle={{ marginHorizontal: 5 }}
              buttonStyle={{ ...styles.roundedButton, backgroundColor: '#04AA6D' }} />
          </View>
        </View>
      </View>
      <View style={styles.imgContainer}>
        <Image source={require('../assets/timeonlogooriginal.jpeg')} style={styles.avatar} />
        <Text style={styles.title}>TimeOn</Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Social Security Number"
          value={ssn}
          onChangeText={(text) => setSSN(formatSSN(text))}
          maxLength={11}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Company ID"
          value={companyId}
          onChangeText={setCompanyId}
        />
        {verificationStatus === 'initial' && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'blue' }]}
            onPress={handleVerification}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        )}
        {verificationStatus === 'red' && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'red' }]}
            onPress={handleVerification}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        )}
        {verificationStatus === 'green' && (
          <TouchableOpacity
            style={[styles.button, { backgroundColor: 'green' }]}
            onPress={handleVerification}
          >
            <Text style={styles.buttonText}>Verify</Text>
          </TouchableOpacity>
        )}

        {verificationStatus === 'green' && (
          <>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              value={firstName}
              onChangeText={setFirstName}
            />
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              value={lastName}
              onChangeText={setLastName}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <View style={styles.dropdownContainer}>
              <Text style={styles.optiontext}>I am an</Text>
              <TouchableOpacity
                style={styles.dropbtn}
                onPress={() => setUserType(userType === 'Admin' ? 'Employee' : 'Admin')}
              >
                <Text style={styles.buttonText}>{userType || 'Select Admin or Employee'}</Text>
              </TouchableOpacity>
            </View>
            {userType === 'Admin' && (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Admin ID"
                  value={adminId}
                  onChangeText={setAdminId}
                />
              </View>
            )}
            {userType === 'Employee' && (
              <View>
                <TextInput
                  style={styles.input}
                  placeholder="Enter Employee ID"
                  value={employeeId}
                  onChangeText={setEmployeeId}
                />
              </View>
            )}
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={securityQuestion1}
                onValueChange={(itemValue, itemIndex) => setSecurityQuestion1(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Security Question 1" value="" />
                <Picker.Item label="What is your mother's maiden name?" value="q1" />
                <Picker.Item label="What was the name of your first pet?" value="q2" />
                {/* Add more options as needed */}
              </Picker>
              {securityQuestion1 && (
                <TextInput
                  style={styles.input}
                  placeholder="Your Answer"
                  value={securityAnswer1}
                  onChangeText={setSecurityAnswer1}
                />
              )}
            </View>

            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={securityQuestion2}
                onValueChange={(itemValue, itemIndex) => setSecurityQuestion2(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select Security Question 2" value="" />
                <Picker.Item label="What is the name of your hometown?" value="q3" />
                <Picker.Item label="What is your favorite movie?" value="q4" />
                {/* Add more options as needed */}
              </Picker>
              {securityQuestion2 && (
                <TextInput
                  style={styles.input}
                  placeholder="Your Answer"
                  value={securityAnswer2}
                  onChangeText={setSecurityAnswer2}
                />
              )}
            </View>
            <TouchableOpacity style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f1f1',
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
    alignItems: 'center',
    borderRadius: 5,
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
  buttonText: {
    color: 'white',
    fontSize: 16
  }
});

export default RegisterScreen;
