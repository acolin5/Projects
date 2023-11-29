import React, { useState, useEffect } from 'react';
import { View, Button, TextInput, Modal, StyleSheet, TouchableOpacity, Text, Picker } from 'react-native';
import { Table, Row } from 'react-native-table-component';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router } from 'expo-router';
import { getDatabase, ref, onValue } from "firebase/database";
import { set as firebaseSet, update as firebaseUpdate } from "firebase/database";


const headers = ["Employee Name", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday", "Hours scheduled"];

const fetchEmployees = () => {
    return new Promise((resolve, reject) => {
        const db = getDatabase();
        const employeesRef = ref(db, 'employees'); // Adjust path as needed

        onValue(employeesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                resolve(Object.values(data)); // Convert object to array if needed
            } else {
                reject('No data available');
            }
        }, (error) => {
            reject(error);
        });
    });
};

const ScheduleComponent = () => {
    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [locations, setLocations] = useState([]);
    const [locationFilter, setLocationFilter] = useState(''); // To store the selected location
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState('EMPLOYEE'); 
    const [newEmployee, setNewEmployee] = useState({ name: '', location: '' });
    const [selectedRowIndex, setSelectedRowIndex] = useState(null);
    const [selectedDay, setSelectedDay] = useState('');
    const [shiftData, setShiftData] = useState({
        startTime: '',
        endTime: '',
        location: ''
    })

    useEffect(() => {
        const db = getDatabase();
        const employeesRef = ref(db, 'employees');
        const locationsRef = ref(db, 'locations');
    
        // Fetch locations
        onValue(locationsRef, (snapshot) => {
            const locationsData = snapshot.val();
            const loadedLocations = locationsData
                ? Object.values(locationsData).map(location => ({ id: location.id, name: location.name }))
                : [];
            setLocations(loadedLocations);
        }, {
            onlyOnce: true
        });
    
        // Fetch employees
        const fetchEmployeesData = () => {
            onValue(employeesRef, (snapshot) => {
                const employeesData = snapshot.val();
                if (employeesData) {
                    const loadedEmployees = Object.keys(employeesData).map(key => ({
                        id: key,
                        name: `${employeesData[key].firstName} ${employeesData[key].lastName}`,
                        location: employeesData[key].location,
                        shifts: employeesData[key].shifts || {},
                    }));
                    setData(loadedEmployees);
                    setFilteredData(loadedEmployees); // Set initial filtered data
                } else {
                    console.log('No employees data available.');
                    setData([]);
                    setFilteredData([]);
                }
            });
        };
    
        fetchEmployeesData(); // Initial fetch of employees
    
        return () => {
            // Detach the listeners if needed
            // This part is essential for cleanup to avoid memory leaks
        };
    }, []);
    

    const handleInputChange = (fieldName, value) => {
        setNewEmployee({ ...newEmployee, [fieldName]: value });
    };

    // Handle location change
    const handleLocationChange = (selectedLocation) => {
        setLocationFilter(selectedLocation);

        if (selectedLocation === '') {
            // If no location is selected, reset to the full list
            setFilteredData(data);
        } else {
            // Filter employees based on selected location
            const filteredEmployees = data.filter(employee => employee.location === selectedLocation);
            setFilteredData(filteredEmployees);
        }
    };

    const renderShiftForDay = (shifts, day) => {
        const shiftDay = day.toLowerCase(); 
        const shift = shifts[shiftDay]; 
        return shift ? `${shift.startTime} - ${shift.endTime} (${shift.hours} hrs)` : "Add Shift";
    };
    
    const totalHoursForWeek = (employeeData) => {
        return Object.values(employeeData.shifts).reduce((total, shift) => total + (shift.hours || 0), 0);
    };
    
    const formatShiftTime = (startTime, endTime, hours) => {
        if (!startTime || !endTime) return ''; 
    
        let [startH, startM] = startTime.split(':').map(Number);
        let [endH, endM] = endTime.split(':').map(Number);
        
        // Convert 24-hour format to 12-hour format with AM/PM
        let startSuffix = startH >= 12 ? 'PM' : 'AM';
        let endSuffix = endH >= 12 ? 'PM' : 'AM';
        startH = startH > 12 ? startH - 12 : startH;
        endH = endH > 12 ? endH - 12 : endH;
    
        // Format minutes to always show as two digits
        startM = startM.toString().padStart(2, '0');
        endM = endM.toString().padStart(2, '0');
    
        return `${startH}:${startM} ${startSuffix} - ${endH}:${endM} ${endSuffix} (${hours} hrs)`;
    };

    const openModalForEmployee = (index) => {
        setModalType('EMPLOYEE');
        setSelectedRowIndex(index);
        setModalVisible(true);
    };

    const openModalForShift = (day, index) => {
        setModalType('SHIFT');
        setSelectedDay(day);
        setSelectedRowIndex(index);
        setModalVisible(true);
    };

    const addEmployeeToSchedule = () => {
        const updatedData = [...data];
        updatedData.push({
            id: data.length,
            name: newEmployee.name,
            shifts: {}
        });
        setData(updatedData);
        setNewEmployee({ name: '' });
        setModalVisible(false);
    };

    const postSchedule = () => {
        const db = getDatabase();
        const scheduleRef = ref(db, 'schedules');
        
        const startDateString = `${selectedDate.getFullYear()}-${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`;
        const endDate = new Date(selectedDate.getTime() + 6 * 24 * 60 * 60 * 1000);
        const endDateString = `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`;
        const formattedSchedule = filteredData.map(employee => {
            const shifts = Object.entries(employee.shifts).reduce((acc, [day, shift]) => {
                acc[day] = {
                    startTime: shift.startTime,
                    endTime: shift.endTime,
                    hours: shift.hours || 'n/a'
                };
                return acc;
            }, {});
            
            return {
                employeeId: employee.id,
                employeeName: employee.name,
                shifts: shifts,
                totalHours: totalHoursForWeek(employee)
            };
        });
        
        const newSchedule = {
            week: `${startDateString} to ${endDateString}`,
            location: locationFilter,
            schedule: formattedSchedule
        };
        
        const schedulePath = `/schedules/${startDateString}`;
        firebaseSet(ref(db, schedulePath), newSchedule)
            .then(() => console.log('New schedule posted successfully!'))
            .catch(error => console.error('Failed to post new schedule:', error));
    };
    
    

    const handleAddShift = () => {
        const hours = calculateHours(shiftData.startTime, shiftData.endTime);
        const updatedData = [...data];
    
        if (!updatedData[selectedRowIndex].shifts) {
            updatedData[selectedRowIndex].shifts = {};
        }
    
        if (!updatedData[selectedRowIndex].shifts[selectedDay]) {
            updatedData[selectedRowIndex].shifts[selectedDay] = {};
        }
    
        updatedData[selectedRowIndex].shifts[selectedDay] = {
            startTime: shiftData.startTime,
            endTime: shiftData.endTime,
            hours: hours 
        };
    
        console.log(`Shifts for employee ${updatedData[selectedRowIndex].name}:`, updatedData[selectedRowIndex].shifts);
    
        setData(updatedData); 
    
      
        if (locationFilter) {
            const newFilteredData = updatedData.filter(employee => employee.location === locationFilter);
            setFilteredData(newFilteredData);
        } else {
            setFilteredData(updatedData);
        }
    
        setModalVisible(false); 
        setShiftData({ startTime: '', endTime: '', location: '' }); 
    };
    


    const calculateHours = (start, end) => {
        if (!start || !end) return 0; // Check for undefined values
    
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);
    
        return (endH + endM / 60) - (startH + startM / 60);
    };
    
    const navigateToAdminPage = () => {
        router.push('/adminPage'); // Navigate to adminPage.js
    };

    const navigateToIndex = () => {
        router.push('/'); // Navigate to index.js
    };

    const moveToPreviousWeek = () => {
        let newDate = new Date(selectedDate.getTime() - 7*24*60*60*1000);
        setSelectedDate(newDate);
    }
    
    const moveToNextWeek = () => {
        let newDate = new Date(selectedDate.getTime() + 7*24*60*60*1000);
        setSelectedDate(newDate);
    }
    
    return (
        <View style={styles.container}>
                       <View style={styles.topBar}>
                <TouchableOpacity onPress={navigateToAdminPage}>
                    <Text style={styles.buttonText}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={navigateToIndex}>
                    <Text style={styles.buttonText}>Logout</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
            <TextInput 
                style={styles.searchInput} 
                placeholder="Find an Employee"
            />
        <Picker
            selectedValue={locationFilter}
            onValueChange={(itemValue, itemIndex) => handleLocationChange(itemValue)}
        >
            <Picker.Item label="Select a Location" value="" />
            {
                locations.map((location) => (
                    <Picker.Item 
                        key={location.id}
                        label={location.name} 
                        value={location.name} 
                    />
                ))
            }

        </Picker>
            <View style={styles.dateDisplay}>
                <TouchableOpacity onPress={moveToPreviousWeek}>
                    <Text>{'<'}</Text>
                </TouchableOpacity>
                <Text>
                    {selectedDate.toLocaleDateString()} - 
                    {new Date(selectedDate.getTime() + 6*24*60*60*1000).toLocaleDateString()}
                </Text>
                <TouchableOpacity onPress={moveToNextWeek}>
                    <Text>{'>'}</Text>
                </TouchableOpacity>
            </View>
            <Button title="Post" onPress={postSchedule} />
        </View>
 
            <DateTimePicker
                value={selectedDate}
                mode={"date"}
                display="default"
                onChange={(event, date) => {
                    date && setSelectedDate(date);
                }}
            />
            <Table borderStyle={{ borderWidth: 1 }}>
                <Row data={headers} style={styles.header} textStyle={styles.headerText} />
                {filteredData.map((employeeData, rowIndex) => (
                <Row
                    key={rowIndex}
                    data={[
                    <TouchableOpacity onPress={() => openModalForEmployee(rowIndex)}>
                        <Text style={styles.rowText}>{employeeData.name || 'Add Employee'}</Text>
                    </TouchableOpacity>,
                    ...headers.slice(1, -1).map((day) => (
                        <TouchableOpacity onPress={() => openModalForShift(day, rowIndex)}>
                        <Text style={styles.rowText}>
                            {employeeData.shifts[day]
                            ? formatShiftTime(
                                employeeData.shifts[day].startTime,
                                employeeData.shifts[day].endTime,
                                calculateHours(
                                    employeeData.shifts[day].startTime,
                                    employeeData.shifts[day].endTime
                                )
                                ) +
                                (employeeData.shifts[day].location
                                ? ` @ ${employeeData.shifts[day].location}`
                                : '')
                            : 'Add Shift'}
                        </Text>
                        </TouchableOpacity>
                    )),
                    <Text style={styles.rowText}>{totalHoursForWeek(employeeData)} hrs</Text>,
                    ]}
                />
                ))}
            </Table>
            <Modal visible={isModalVisible} animationType="slide">
                {modalType === 'EMPLOYEE' ? (
                    <>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Employee Name" 
                            onChangeText={text => setNewEmployee(prev => ({ ...prev, name: text }))} 
                            value={newEmployee.name} 
                        />
                        <Button title="Add Employee" onPress={addEmployeeToSchedule} />
                    </>
                ) : (
                    <>
                        <TextInput 
                            style={styles.input} 
                            placeholder="Start Time (e.g. 08:00)" 
                            onChangeText={text => setShiftData(prev => ({ ...prev, startTime: text }))} 
                            value={shiftData.startTime}
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="End Time (e.g. 17:00)" 
                            onChangeText={text => setShiftData(prev => ({ ...prev, endTime: text }))} 
                            value={shiftData.endTime}
                        />
                        <TextInput 
                            style={styles.input} 
                            placeholder="Location" 
                            onChangeText={text => setShiftData(prev => ({ ...prev, location: text }))} 
                            value={shiftData.location}
                        />
                        <Button title="Add Shift" onPress={handleAddShift} />
                    </>
                )}
                <Button title="Close" onPress={() => setModalVisible(false)} />
            </Modal>

            <Button title="Add New Employee" onPress={() => openModalForEmployee(data.length)} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#f4f4f4'
    },
    searchContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    searchInput: {
        flex: 2,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 8,
        marginRight: 5
    },
    dateDisplay: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    pickerStyle: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
    },
    input: {
        marginVertical: 10,
        paddingHorizontal: 5,
        paddingVertical: 6,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    header: {
        backgroundColor: '#e0e0e0',
        padding: 0,
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        // any other style properties
      },
    rowText: {
        padding: 10,
        textAlign: 'center',
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
        fontSize: 16
    }
});

export default ScheduleComponent;
