import React from 'react';
import { View, ScrollView,StyleSheet, Image} from 'react-native';
import { Icon, Text, Button } from 'react-native-elements';
import { router } from 'expo-router';


const AdminPage = () => {
  const features = [
    { name: 'Human Resource', icon: 'group', route:'/hr' },
    { name: 'Budget', icon: 'account-balance' },
    { name: 'Schedule', icon: 'schedule', route: '/schedule' },
  ];

  function handleLogout(){
    router.push('/');
  }
  return (
    <ScrollView style={{ flex: 1, padding: 10 }}>
       
      {/* This is the Top Bar with Logo and Logout */}
      <View style={styles.topBar}>
        
        {/* Logo goes hereeeee*/}
        <Image
          source={{ uri: 'https://cdn.glitch.global/1c8d8485-d588-4c98-aa36-65523065f7c6/thumbnails%2Fideogram%20(7).jpeg?1695770167340' }}
          style={{ width: 50, height: 50, borderRadius: 25 }}
        />
        <Button
          title="Logout"
          onPress={handleLogout}
          buttonStyle={{ backgroundColor: 'red' }} // Customize button styles
        />
      </View>
      
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {features.map((feature, index) => (
          <Button 
            key={index} 
            containerStyle={{ width: '30%', margin: 5 }}
            buttonStyle={{ padding: 10, backgroundColor: '#BFF5BF' }} 
            titleStyle={{ fontSize: 14, color: '#058C42' }} 
            icon={
              <Icon 
                name={feature.icon} 
                size={40} 
                color="#058C42" 
                style={{ marginBottom: 5 }}
              />
            }
            title={feature.name}
            onPress={() => {
                router.push(feature.route);
            }}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      // backgroundColor: '#04AA6D'
    },
    contentContainer: {
      flex: 1,
      width: '70%', 
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
    }
});

export default AdminPage;