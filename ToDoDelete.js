import AsyncStorage from '@react-native-async-storage/async-storage';
import { DELETE_TODO } from '../GlobalStateHandler/TodoContext';
import React, { useState, useEffect } from 'react';
import {View,Text,TouchableOpacity,StyleSheet,TextInput,Platform} from 'react-native';


const Utils = {
  async todoDelete(index, todoList, setTodoList, dispatch) {
    
    // Create a copy of the todoList
    const newToDoList = [...todoList];
    
    try {
      // Remove the item at the specified index
      newToDoList.splice(index, 1);

      // Convert the updated todoList to JSON
      const jsonValue = JSON.stringify(newToDoList);

      // Update AsyncStorage with the new todoList
      await AsyncStorage.setItem('todoList', jsonValue);

      // Update the state with the new todoList
      setTodoList(newToDoList);

      // Dispatch the DELETE_TODO action with the correct payload
      dispatch({ type: DELETE_TODO, payload: index });

      console.log('Todo deleted successfully. Updated todoList:', newToDoList);
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  },
};

export default Utils;