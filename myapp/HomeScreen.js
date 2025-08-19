import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from "react-native";
import { database, auth } from "./firebaseConfig";
import { ref, push, onValue, update, remove } from "firebase/database";
import { signOut } from "firebase/auth";

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState("");
  const [items, setItems] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const itemsRef = ref(database, "items/");
    const unsubscribe = onValue(itemsRef, snapshot => {
      const data = snapshot.val();
      setItems(data || {});
    });
    return () => unsubscribe();
  }, []);

  const handleSave = () => {
    if (!name.trim()) return;
    if (editingId) {
      update(ref(database, `items/${editingId}`), { name });
      setEditingId(null);
    } else {
      push(ref(database, "items/"), { name });
    }
    setName("");
  };

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setName(currentName);
  };

  const handleDelete = (id) => remove(ref(database, `items/${id}`));
  const handleLogout = async () => { await signOut(auth); navigation.replace("Login"); };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lista de Tarefas</Text>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Digite um nome"
        value={name}
        onChangeText={setName}
        placeholderTextColor="#8B5E3C"
      />
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>{editingId ? "Atualizar" : "Adicionar"}</Text>
      </TouchableOpacity>

      <FlatList
        data={Object.entries(items)}
        keyExtractor={([id]) => id}
        renderItem={({ item: [id, value] }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{value.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity style={styles.editButton} onPress={() => handleEdit(id, value.name)}>
                <Text style={styles.actionText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(id)}>
                <Text style={styles.actionText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F5EFE6" },
  title: { fontSize: 28, fontWeight: "bold", color: "#8B5E3C", marginBottom: 15 },
  logoutButton: { backgroundColor: "#A36F4A", padding: 10, borderRadius: 20, alignItems: "center", marginBottom: 15 },
  logoutText: { color: "#FFF3E6", fontWeight: "bold" },
  input: { borderWidth: 1, borderColor: "#C9A77E", padding: 12, marginBottom: 10, borderRadius: 25, backgroundColor: "#FFF3E6" },
  saveButton: { backgroundColor: "#A36F4A", padding: 12, borderRadius: 25, alignItems: "center", marginBottom: 15 },
  saveText: { color: "#FFF3E6", fontWeight: "bold" },
  item: { padding: 15, marginVertical: 5, borderRadius: 15, backgroundColor: "#E6D3B3", shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.2, shadowRadius: 1.41, elevation: 2 },
  itemText: { fontSize: 18, color: "#5B3A29", fontWeight: "bold" },
  actions: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  editButton: { backgroundColor: "#C9A77E", padding: 8, borderRadius: 15 },
  deleteButton: { backgroundColor: "#8B5E3C", padding: 8, borderRadius: 15 },
  actionText: { color: "#FFF3E6", fontWeight: "bold" },
});
