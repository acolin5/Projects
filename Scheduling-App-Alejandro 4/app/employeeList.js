import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Picker, CheckBox, TextInput, FlatList } from 'react-native';
import { router } from 'expo-router';
import { useEffect, button } from 'react';
import { getDatabase, ref, set, onValue, off, update} from "firebase/database";

const ELComponent = () => {
 
  const navigateToAdminPage = () => {
    router.push('/adminPage');
  };

  const navigateToIndex = () => {
    router.push('/'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={navigateToAdminPage}>
          <Text style={styles.roundedButton}>Home</Text>
        </TouchableOpacity>
        <Text style={styles.center}>Employee List</Text>
        <TouchableOpacity onPress={navigateToIndex}>
          <Text style={styles.roundedButton}>Logout</Text>
        </TouchableOpacity>
      </View>
      <EmployeeList />
    </View>
  );
};

const EmployeeList =() => {
    const [employees, setEmployees] = useState([]);
    const [currentEmployee, setCurrentEmployee] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [locations, setLocations] = useState([]);
    const [newEmployee, setNewEmployee] = useState({
        lastName: '',
        firstName: '',
        id: '',
        position: '',
        location: '',
        socialSecurity: '',
        pay: '',
        status: '',
        
    });

    const handleInputChange = (fieldName, value) => {
      setNewEmployee({ ...newEmployee, [fieldName]: value });
  };

    const submitEmployees = () => {
        const db = getDatabase();
        const employeesRef = ref(db, 'employees'); 
    
        set(employeesRef, employees)
        .then(() => {
            console.log('Employee list saved successfully!');
            // Handle successful write here, like clearing the form or showing a message
        })
        .catch((error) => {
            console.error('Error saving employee list:', error);
            // Handle errors here, like showing an error message
        });
    };
    
    useEffect(() => {
      const db = getDatabase();
      const employeesRef = ref(db, 'employees');
      const locationsRef = ref(db, 'locations'); // adjust the path to your locations node
  
      // Subscribe to employees
      const unsubscribeEmployees = onValue(employeesRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
              // Convert the data from object to array
              const employeeArray = Object.keys(data).map((key) => {
                  return {...data[key], id: key}; 
              });
              setEmployees(employeeArray);
          } else {
              setEmployees([]);
          }
      });
  
      // Subscribe to locations
      const unsubscribeLocations = onValue(locationsRef, (snapshot) => {
          const locationsData = snapshot.val();
          const loadedLocations = locationsData 
              ? Object.keys(locationsData).map(key => ({
                    id: key,
                    name: locationsData[key].name, // adjust according to your data structure
                }))
              : [];
          setLocations(loadedLocations);
      }, {
          onlyOnce: true
      });
  
      // Cleanup function to detach the listeners
      return () => {
          off(employeesRef);
          off(locationsRef);
      };
  }, []);
  
    const handleEditEmployee = (employee) => {
        setCurrentEmployee(employee);
        setModalVisible(true);
      };
    
      const handleSaveEmployee = () => {
        if (!currentEmployee) return;
    
        const db = getDatabase();
        const employeeRef = ref(db, 'employees/' + currentEmployee.id);
    
        update(employeeRef, currentEmployee)
          .then(() => {
            // TOODO: Handle successful update here
            setModalVisible(false); 
            setCurrentEmployee(null); // Reset the current employee
          })
          .catch((error) => {
            //TODO: Handle errors here
            console.error('Error updating employee:', error);
          });
      };
    
      const handleModalInputChange = (field, value) => {
        setCurrentEmployee({ ...currentEmployee, [field]: value });
      };
    

    const addEmployee = () => {
        if (newEmployee.lastName && newEmployee.firstName && newEmployee.position) {
            setEmployees([...employees, newEmployee]);
            setNewEmployee({
                lastName: '',
                firstName: '',
                id: '',
                position: '',
                location: '',
                socialSecurity: '',
                pay: '',
                status: '',
            });
        }
    };

    // Render function for the header
    const renderHeader = () => (
        <View style={styles.headerRow}>
            <Text style={styles.headerItem}>Last Name</Text>
            <Text style={styles.headerItem}>First Name</Text>
            <Text style={styles.headerItem}>ID</Text>
            <Text style={styles.headerItem}>Position</Text>
            <Text style={styles.headerItem}>Location</Text>
            <Text style={styles.headerItem}>Social Security</Text>
            <Text style={styles.headerItem}>Salary</Text>
            <Text style={styles.headerItem}>Status</Text>
        </View>
    );

    // Render function for each employee row
    const renderEmployeeRow = ({ item }) => (
        <View style={styles.employeeRow}>
            <Text>{item.lastName}</Text>
            <Text>{item.firstName}</Text>
            <Text>{item.id}</Text>
            <Text>{item.position}</Text>
            <Text>{item.location}</Text>
            <Text>{item.socialSecurity}</Text>
            <Text>{item.pay}</Text>
            <Text>{item.status}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.tableContainer}>
                <FlatList
                    data={employees}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={renderEmployeeRow}
                    ListHeaderComponent={renderHeader} // Corrected this line
                />
            </View>
            <View style={styles.addEmployeeContainer}>
            {modalVisible && currentEmployee && (
                <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
                >
            <View style={styles.modalView}>
            {/* TextInputs for editing employee details */}
            <TextInput
              style={styles.input}
              value={currentEmployee.lastName}
              onChangeText={(text) => handleModalInputChange('lastName', text)}
              placeholder="Last Name"
            />
            <Button title="Save Changes" onPress={handleSaveEmployee} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      )}
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    value={newEmployee.lastName}
                    onChangeText={(text) => handleInputChange('lastName', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    value={newEmployee.firstName}
                    onChangeText={(text) => handleInputChange('firstName', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="ID"
                    value={newEmployee.id}
                    onChangeText={(Number) => handleInputChange('id', Number)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Position"
                    value={newEmployee.position}
                    onChangeText={(text) => handleInputChange('position', text)}
                />
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={newEmployee.location}
                    onValueChange={(itemValue, itemIndex) => handleInputChange('location', itemValue)}
                  >
                    <Picker.Item label="Select a Location" value="" />
                    {locations.map((location) => (
                      <Picker.Item key={location.id} label={location.name} value={location.name} />
                    ))}
                  </Picker>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Social Security"
                    value={newEmployee.socialSecurity}
                    onChangeText={(text) => handleInputChange('socialSecurity', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Salary"
                    value={newEmployee.pay}
                    onChangeText={(text) => handleInputChange('pay', text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Status"
                    value={newEmployee.status}
                    onChangeText={(text) => handleInputChange('status', text)}
                />
                <View style={styles.buttonRow}>
                    <TouchableOpacity onPress={addEmployee}>
                    <Text style={styles.addButton}>Add Employee</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={submitEmployees}>
                    <Text style={styles.submitButton}>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleEditEmployee}>
                    <Text style={styles.editButton}>Edit</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  pickerContainer: {
    paddingVertical: 7,
    height: 40,
    borderColor: 'gray',
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    width: '82%',
    justifyContent: 'center',
    margin: 5, 
  },
  
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
    borderRadius: 20,
    margin: 10,
    overflow: 'hidden',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    backgroundColor: '#ff0000',
    textAlign: 'center',
  },
  roundedButton: {
    borderRadius: 25,
    backgroundColor: '#50C878',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  center: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  tableContainer: {
    flex: 1,
    marginTop: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
},
submitButton: {
    backgroundColor: '#50C878',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
},
editButton: {
    backgroundColor: '#50C878',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
},
headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#eaeaea', // You can change the background color as needed
    paddingVertical: 10,
},
headerItem: {
    fontWeight: 'bold',
    // Add more styling as needed to match the width of the items in the employeeRow
},
  employeeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
  },

  addEmployeeContainer: {
    marginTop: 20,
  },

  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },

  addButton: {
    backgroundColor: '#50C878',
    color: 'white',
    padding: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: '80%', // Example width
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  },
  modalButton: {
    borderRadius: 20,
    padding: 10,
    elevation: 2
  },
  modalButtonClose: {
    backgroundColor: "#2196F3",
  },
  modalButtonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
});

export default ELComponent;
