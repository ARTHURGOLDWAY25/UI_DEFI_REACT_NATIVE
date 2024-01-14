import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet, // Add StyleSheet here
  } from 'react-native';
  
  import React from 'react';
  import Utils from '../Services/TodoDelete';
  import HomePage from '../App'
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import PropTypes from 'prop-types';
  
  
  
  
  function ToDoCardStyle({ title, description, onDelete, checked, handleCheckedChange }) {
    // Assuming onDelete is a function received as a prop
    const handleDelete = async () => {
      
      try {
        // Call the onDelete function with the correct parameters
        
        await onDelete();
      } catch (error) {
        console.error('Error deleting todo:', error);
      }
    };
  
    return (
      <View style={styles.container}>
  
        <TouchableOpacity style={styles.checkBox} onPress={handleCheckedChange}>
          {checked && <Ionicons name='checkmark' size={24} color='black'/>}
        </TouchableOpacity>
  
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description === "" ? 'No Description' : description}</Text>
  
          <TouchableOpacity onPress={() => onUpdate({title, description, checked}) }>
            <Text style={styles.DeleteText}>Delete</Text>
          </TouchableOpacity>
  
        </View>
      </View>
    );
  }
  
  ToDoCardStyle.propTypes={
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    onDelete: PropTypes.func.isRequired,
    checked: PropTypes.bool.isRequired,
    handleCheckedChange: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,  // Add this line
  }
  
  export default ToDoCardStyle;
  
  
  
  
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(0, 0, 0, 0.5)',
      width: '100%',
      marginBottom: 16,
      paddingBottom: 8,
    },
    checkBox: {
      width: 40,
      height: 40,
      marginLeft: 13,
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.5)',
      borderRadius: 4,
      justifyContent: 'center',
      alignItems: 'center',
      
    },
    textContainer: {
      flex: 1,
      marginLeft: 10,
      marginTop: -10, // Adjust the marginTop to move the title higher
    },
    title: {
      color: '#2b3536',
      margin: 5,
      fontSize: 17,
      fontWeight: 500,
    },
    description: {
      color: '#2b3536',
      margin: 5,
      fontSize: 15,
      marginTop: -5,
      marginBottom: 15,
    },
    DeleteText:{
      color:'#0a56fa',
      marginLeft: 10,
    }
  });