import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Picker, CheckBox, TextInput } from 'react-native';
import { router } from 'expo-router';

const HRComponent = () => {

  const navigateToAdminPage = () => {
    router.push('/adminPage'); // Navigate to adminPage.js
  };

  const navigateToIndex = () => {
    router.push('/'); // Navigate to index.js
  };
  const navigatetoEmployeeList = () => {
    router.push('/employeeList'); 
  };
  const createNewLocation = () => {
    router.push('/newLocation'); 
  };
  const createNewPosition = () => {
    router.push('/position');
  };


  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={navigateToAdminPage}>
          <Text style={styles.roundedButton}>Home</Text>
        </TouchableOpacity>
        <Text style={styles.center}>Human Resources </Text>
        <TouchableOpacity onPress={navigatetoEmployeeList}>
          <Text style={styles.roundedButton}>Logout</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.newNewHeader}><TouchableOpacity onPress={navigatetoEmployeeList}>Employee List</TouchableOpacity></Text>
      <View style={styles.inputContainer2}>
      </View>
    <Text style={styles.newNewHeader}><TouchableOpacity onPress={createNewLocation}>Create New Location</TouchableOpacity></Text>
      <View style={styles.inputContainer2}>
      </View>
      <Text style={styles.newNewHeader}><TouchableOpacity onPress={createNewPosition}>Create New Position</TouchableOpacity></Text>
      <View style={styles.inputContainer2}>
      </View>
      <FrontPage />
      <MiddlePage />
      <BottomPage />
    </View>
  );
};

const FrontPage = () => {

    const [selectedOption, setSelectedOption] = useState('');
    const [isSelected1, setSelection1] = useState(false);
    const [isSelected2, setSelection2] = useState(false);
    const [isSelected3, setSelection3] = useState(false);

  return (
    <View style={styles.newGoalContainer}>
      <Text style={styles.newGoalHeader}>Create New Goal</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Keep</Text>
        <Picker
          selectedValue={selectedOption}
          onValueChange={(itemValue) => setSelectedOption(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Option 1" value="option1" />
          <Picker.Item label="Option 2" value="option2" />
          <Picker.Item label="Option 3" value="option3" />
        </Picker>
      </View>

      <View style={styles.quickGoalsContainer}>
        <Text style={styles.quickGoalsHeader}>Quick Goals</Text>

        <View style={styles.checkboxContainer}>
          <View style={styles.checkboxRow}>
            <CheckBox
              value={isSelected1}
              onValueChange={() => setSelection1(!isSelected1)}
              style={styles.checkbox}
            />
            <Text style={styles.label}>Option 1</Text>
          </View>

          <View style={styles.checkboxRow}>
            <CheckBox
              value={isSelected2}
              onValueChange={() => setSelection2(!isSelected2)}
              style={styles.checkbox}
            />
            <Text style={styles.label}>Option 2</Text>
          </View>

          <View style={styles.checkboxRow}>
            <CheckBox
              value={isSelected3}
              onValueChange={() => setSelection3(!isSelected3)}
              style={styles.checkbox}
            />
            <Text style={styles.label}>Option 3</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const MiddlePage = () => {
    const [grossSales, setGrossSales] = useState('');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [selectedLocation, setSelectedLocation] = useState('');
    const [totalExpenses, setTotalExpenses] = useState('');
    const [expensesMonth, setExpensesMonth] = useState('');
    const [expensesLocation, setExpensesLocation] = useState('');
  
    return (
      <View style={styles.middlePageContainer}>
        <Text style={styles.middlePageHeader}>Input Financials</Text>
  
        {/* Gross Sales Section */}
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Gross Sales:</Text>
          <TextInput
            style={styles.textInput}
            value={grossSales}
            onChangeText={(text) => setGrossSales(text)}
            placeholder="Enter gross sales"
          />
        </View>
  
        {/* Month and Location Section */}
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Month:</Text>
          <Picker
            selectedValue={selectedMonth}
            onValueChange={(itemValue) => setSelectedMonth(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="January" value="January" />
            <Picker.Item label="February" value="February" />
            {/* Add more months as needed */}
          </Picker>
  
          <Text style={styles.inputLabel}>Location:</Text>
          <Picker
            selectedValue={selectedLocation}
            onValueChange={(itemValue) => setSelectedLocation(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Location 1" value="Location 1" />
            <Picker.Item label="Location 2" value="Location 2" />
            {/* Add more locations as needed */}
          </Picker>
        </View>
  
        {/* Total Expenses Section */}
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Total Expenses:</Text>
          <TextInput
            style={styles.textInput}
            value={totalExpenses}
            onChangeText={(text) => setTotalExpenses(text)}
            placeholder="Enter total expenses"
          />
        </View>
  
        {/* Expenses Month and Location Section */}
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Month:</Text>
          <Picker
            selectedValue={expensesMonth}
            onValueChange={(itemValue) => setExpensesMonth(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="January" value="January" />
            <Picker.Item label="February" value="February" />
            {/* Add more months as needed */}
          </Picker>
  
          <Text style={styles.inputLabel}>Location:</Text>
          <Picker
            selectedValue={expensesLocation}
            onValueChange={(itemValue) => setExpensesLocation(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Location 1" value="Location 1" />
            <Picker.Item label="Location 2" value="Location 2" />
            {/* Add more locations as needed */}
          </Picker>
        </View>
      </View>
    );
  };

const BottomPage = () => {
    const [expenses, setExpenses] = useState([]);
    const [newExpenseTitle, setNewExpenseTitle] = useState('');
    const [newExpenseAmount, setNewExpenseAmount] = useState('');
  
    const addNewExpense = () => {
      // Check if both title and amount are provided
      if (newExpenseTitle && newExpenseAmount) {
        const newExpense = {
          title: newExpenseTitle,
          amount: newExpenseAmount,
        };
  
        // Add the new expense to the expenses array
        setExpenses([...expenses, newExpense]);
  
        // Clear the input fields after adding a new expense
        setNewExpenseTitle('');
        setNewExpenseAmount('');
      }
    };
  
    return (
      <View style={styles.bottomPageContainer}>
        <Text style={styles.bottomPageHeader}>Input Expenses</Text>
  
        {/* Expense Input Section */}
        <View style={styles.inputRow}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Title:</Text>
            <TextInput
              style={styles.textInput}
              value={newExpenseTitle}
              onChangeText={(text) => setNewExpenseTitle(text)}
              placeholder="Enter title"
            />
          </View>
  
          <View style={styles.amountInputContainer}>
            {/* Rename the style to amountInputContainer */}
            <Text style={styles.inputLabel}>Amount:</Text>
            <TextInput
              style={styles.textInput}
              value={newExpenseAmount}
              onChangeText={(text) => setNewExpenseAmount(text)}
              placeholder="Enter amount"
              keyboardType="numeric"
            />
          </View>
        </View>
  
        {/* Button to Add New Expense */}
        <TouchableOpacity onPress={addNewExpense} style={styles.greenButton}>
          <Text style={styles.buttonText}>Add Expense</Text>
        </TouchableOpacity>
  
        {/* Display the List of Expenses */}
        {expenses.map((expense, index) => (
          <View key={index} style={styles.expenseRow}>
            <Text style={styles.expenseTitle}>{expense.title}:</Text>
            <Text style={styles.expenseAmount}>${expense.amount}</Text>
          </View>
        ))}
      </View>
    );
  };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
  newGoal: {
    
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
  newGoalContainer: {
    backgroundColor: '#EDEDED',
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
  },
  newGoalHeader: {
    fontSize: 28,
    textDecorationLine: 'underline',
    marginBottom: 10,
  },
  newNewHeader: {
    fontSize: 28,
    textDecorationLine: 'underline',
    marginBottom: 5,
    alignItems: 'center'
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputContainer2: {
    marginBottom: 5,
    alignContent: 'center',
  },
  inputLabel: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
    marginTop: 15,
    padding: 10,
    
  },
  picker: {
    height: 50,
    width: '100%',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
  },
  quickGoalsContainer: {
    backgroundColor: '#F4F4F4',
    padding: 20,
    borderRadius: 10,
  },
  quickGoalsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkboxContainer: {
    flexDirection: 'column',
    marginBottom: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkbox: {
    marginLeft: 10,
  },
  label: {
    marginLeft: 10,
  },
  middlePageContainer: {
    backgroundColor: 'white',
    borderColor: '#e1e1e1',
    paddingLeft: 10,
    
  },
  middlePageHeader: {
    fontSize: 32,
    padding: 10,
    textDecorationLine: 'underline',
    paddingTop: 20,
    paddingBottom: 20,
  },
  bottomPageContainer: {
    backgroundColor: '#d3d3d3',
  },
  bottomPageHeader: {
    fontSize: 32,
    padding: 10,
    textDecorationLine: 'underline',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    height: 40,
    paddingLeft: 10,
    flex: 1,
  },
  inputContainer: {
    flex: 1,
    marginRight: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },  
  picker: {
    height: 40,
    width: 150,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 10,
    marginLeft: 10,
    marginRight: 10,
  },  
  halfInput: {
    flex: 1,
    marginRight: 10,
  },
  expenseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  expenseTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  expenseAmount: {
    fontSize: 18,
    color: '#50C878',
  },
  greenButton: {
    borderRadius: 25,
    backgroundColor: '#ff0000',
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginTop: 10, // Adjust the margin as needed
  },
});

export default HRComponent;
