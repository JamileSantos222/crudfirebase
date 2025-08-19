import React, { useState } from "react";
import { View, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebaseConfig";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, senha);
      navigation.replace("Home");
    } catch (error) {
      setErro("Erro ao entrar: " + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#8B5E3C"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
        placeholderTextColor="#8B5E3C"
      />

      {erro ? <Text style={styles.error}>{erro}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
        <Text style={styles.link}>Criar uma conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#F5EFE6" },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 30, color: "#8B5E3C", textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#C9A77E", padding: 12, marginBottom: 15, borderRadius: 25, backgroundColor: "#FFF3E6" },
  button: { backgroundColor: "#A36F4A", padding: 15, borderRadius: 25, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "#FFF3E6", fontWeight: "bold", fontSize: 16 },
  link: { color: "#8B5E3C", textAlign: "center", marginTop: 10, textDecorationLine: "underline" },
  error: { color: "red", marginBottom: 10, textAlign: "center" },
});
