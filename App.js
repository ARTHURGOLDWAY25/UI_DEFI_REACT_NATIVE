import React, { useState, useEffect } from 'react';
import {ScrollView,Text,TouchableOpacity,StyleSheet,TextInput,Platform} from 'react-native';
import { NavigationContainer,useNavigation} from '@react-navigation/native'; 
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import {TodoProvider,useTodo,ADD_TODO,DELETE_TODO,UPDATE_TODO,} from './GlobalStateHandler/TodoContext';
import ToDoCardStyle from './ToDoCardStyle/ToDoCardStyle'
import Utils from './Services/TodoDelete'
import Ionicons from 'react-native-vector-icons/Ionicons';


async function AsyncStorageCRUD() {
  try {
    const savedTodoList = await AsyncStorage.getItem('todoList');
    if (savedTodoList) {
      console.log('Retrieved Todo List:', savedTodoList);
      return JSON.parse(savedTodoList);
    }
  } catch (error) {
    console.error(error);
    return [];
  }
}


function HomePage() {
  const navigation = useNavigation();
  const { state, setTodoList, dispatch } = useTodo();
  const { todoList } = state;
  const {Create, Update} = AsyncStorageCRUD()

  useEffect(() => {
    async function loadTodoList() {
      try {
        const savedList = await AsyncStorageCRUD();
        console.log('Loaded todoList:', savedList);
        setTodoList(savedList);
      } catch (error) {
        console.error('Error loading todoList:', error);
      }
    }
    loadTodoList();
  }, [setTodoList]);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {Array.isArray(todoList) &&
  todoList.map(({ title, description, id, checked }, index) => (
    function handleCheckedChange () {
      Update(index, {title, description, checked: !checked})
    },
    <ToDoCardStyle
  key={id || index}
  title={title}
  description={description}
  checked={checked}
  handleCheckedChange={handleCheckedChange(index, toDo)}
  onDelete={() => Utils.todoDelete(index, todoList, setTodoList, dispatch)}
/>
  ))}
      <TouchableOpacity
        style={styles.buttonStyle}
        onPress={() => navigation.navigate('ToDoCreatePage')}
      >
        <Text style={styles.textStyle}>Add-a-todo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

function ToDoCreatePage({ navigation }) {
  const { dispatch, setTodoList, state } = useTodo();
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const { todoList } = state;

  const handleInputValue = async () => {
    if (title === '') {
      console.log('Title is empty');
      return alert('The task requires a title');
    }

    console.log('Title:', title);
    console.log('Description:', description);

    await Create({ title, description, checked: false });
    setTitle('');
    setDescription('');
    setMessage('');

    // Navigate back to HomePage
    navigation.navigate('Home');

  };

  const fieldsTab = [
    {
      key: 'title',
      label: 'Title',
      placeholder: 'Name of the task to do',
      onChangeText: (text) => setTitle(text),
    },
    {
      key: 'description',
      label: 'Description',
      placeholder: 'Description (Optional)',
      onChangeText: (text) => setDescription(text),
    },
  ];
  
    async function Update(index, toDo) {
    const newToDoList = [...todoList];
    try {
      newToDoList.splice(index, 1, toDo);
      const jsonValue = JSON.stringify(newToDoList);
      await AsyncStorage.setItem('todoList', jsonValue);
      setTodoList(newToDoList);
      dispatch({ type: UPDATE_TODO, payload: { title, description } });
    } catch (error) {
      console.error(error);
    }
  }

  async function Create(toDo) {
    console.log('Creating todo:', toDo);
    const newToDoList = [...todoList, toDo];
    try {
      const jsonValue = JSON.stringify(newToDoList);
      await AsyncStorage.setItem('todoList', jsonValue);
      setTodoList(newToDoList);
    } catch (error) {
      console.error(error);
    }
    dispatch({ type: ADD_TODO, payload: { title, description } });
  }

  return (
    <ScrollView contentContainerStyle={styles.createTodoPageContainer}>
      
      {fieldsTab.map((field) => (
        <TextInput
          style={styles.input}
          key={field.key}
          placeholder={field.placeholder}
          onChangeText={field.onChangeText}
        />
      ))}
      {message ? <Text>{message}</Text> : null}
      <TouchableOpacity
        style={styles.popUpTouchStyle}
        onPress={handleInputValue}
      >
        <Text style={{ color: 'white' }}>To-do add</Text>
      </TouchableOpacity>
    </ScrollView>
  );

}

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <TodoProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name='Home'
            component={HomePage}
            options={{ headerShown: false, presentation: 'modal' }}
          />
          <Stack.Screen
            name='ToDoCreatePage'
            component={ToDoCreatePage}
            options={{ presentation: 'modal' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TodoProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d0dbdb',
  },
  createTodoPageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#d0dbdb',
  },
  buttonStyle: {
    backgroundColor: '#29a2e3',
    width: '99%',
    alignItems: 'center',
    marginTop: 5,
    borderRadius: 4,
    paddingVertical: 10,
  },
  textStyle: {
    color: 'white',
  },
  popUpTouchStyle: {
    backgroundColor: '#29a2e3',
    width: '90%',
    alignItems: 'center',
    marginTop: 15,
    borderRadius: 8,
    paddingVertical: 10,
  },
  input: {
    borderWidth: 0,
  //borderColor: 'transparent',
  //underlineColorAndroid: 'transparent',
   // Set the outline width to 0 outlineWidth: 0,
  //borderBottomColor: '#b9c1c4',
    outlineWidth: 0,
    width: '90%',
    padding: 20,
    ...Platform.select({
      android: {
        borderBottomColor: 'black',
        borderBottomWidth: 0.5,
      },
    }),
  },
});
