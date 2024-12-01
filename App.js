import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { initDB, loginUser, registerUser } from './MyUtils/MyDB';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  // what is useEffect?
  // this is a hook that runs when the component is mounted
  useEffect(() => {
    initDB()
    checkLoginStatus()
  }, [])

  const checkLoginStatus = async () => {
    const status = await AsyncStorage.getItem('isLoggedIn')
    if (status === 'true') {
      setIsLoggedIn(true)
    }
  }

  const handleSubmit = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      if (isLogin) {
        const success = await loginUser(username, password);
        if (success) {
          await AsyncStorage.setItem('isLoggedIn', 'true');
          setIsLoggedIn(true);
          Alert.alert('Success', 'Logged in successfully');
        } else {
          Alert.alert('Error', 'Invalid credentials');
        }
      } else {
        try {
          await registerUser(username, password);
          Alert.alert('Success', 'Registration successful');
          setIsLogin(true);
        } catch (error) {
          if (error.message === 'Username already exists.') {
            Alert.alert('Error', 'This username is already taken.');
          } else {
            Alert.alert('Error', error.message);
          }
        }
      }
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      Alert.alert('Error', 'An unexpected error occurred. Please try again.');
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('isLoggedIn')
    setIsLoggedIn(false)
    setUsername('')
    setPassword('')
  }

  if (isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loggedInContainer}>
          <Image
            source={require('./assets/MyAvatar.png')}
            style={styles.logo}
          />
          <Text style={styles.welcomeTitle}>
            Welcome, {username}!
          </Text>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.formContainer}>
          <Image
            source={require('./assets/MyAvatar.png')}
            style={styles.logo}
          />
          <Text style={styles.title}>
            {isLogin ? 'Welcome user' : 'Create your account'}
          </Text>
          <Text style={styles.subtitle}>
            {isLogin
              ? 'Sign in to continue'
              : 'Fill in the form to continue'}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor="#666"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              placeholderTextColor="#666"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity
            style={styles.mainButton}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>
              {isLogin ? 'Sign In' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.switchButton}
            onPress={() => setIsLogin(!isLogin)}
          >
            <Text style={styles.switchText}>
              {isLogin
                ? 'New user? Create your account'
                : 'Already have an account? Sign in'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
      <StatusBar style="auto" />
    </SafeAreaView>
  )
}

//stylesheet for app
const styles = StyleSheet.create({
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  keyboardView: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#fff',
    width: '100%',
    height: 50,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  loggedInContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  logoutButton: {
    backgroundColor: '#2333',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: 'FF3B30',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mainButton: {
    backgroundColor: '#007AFF',
    width: '100%',
    height: 50,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#007AFF',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  switchButton: {
    padding: 10,
  },
  switchText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
});