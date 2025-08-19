import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { database, auth } from './firebaseConfig';
import { ref, push, onValue, update, remove } from 'firebase/database';
import { signOut } from 'firebase/auth';

export default function HomeScreen({ navigation }) {
  const [name, setName] = useState('');
  const [items, setItems] = useState({});
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const itemsRef = ref(database, 'items/');
    const unsubscribe = onValue(itemsRef, snapshot => {
      const data = snapshot.val();
      setItems(data || {});
    });
    return () => unsubscribe();
  }, []);

  const handleSave = () => {
    if (name.trim() === '') return;

    if (editingId) {
      update(ref(database, `items/${editingId}`), { name });
      setEditingId(null);
    } else {
      push(ref(database, 'items/'), { name });
    }

    setName('');
  };

  const handleEdit = (id, currentName) => {
    setEditingId(id);
    setName(currentName);
  };

  const handleDelete = (id) => {
    remove(ref(database, `items/${id}`));
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigation.replace("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>CRUD com Firebase</Text>

      <Button title="Sair" color="red" onPress={handleLogout} />

      <TextInput
        style={styles.input}
        placeholder="Digite um nome"
        value={name}
        onChangeText={setName}
      />

      <Button title={editingId ? "Atualizar" : "Adicionar"} onPress={handleSave} />

      <FlatList
        data={Object.entries(items)}
        keyExtractor={([id]) => id}
        renderItem={({ item: [id, value] }) => (
          <View style={styles.item}>
            <Text style={styles.itemText}>{value.name}</Text>
            <View style={styles.actions}>
              <Button title="Editar" onPress={() => handleEdit(id, value.name)} />
              <Button title="Excluir" color="red" onPress={() => handleDelete(id)} />
            </View>
          </View>
        )}
      />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  item: { padding: 10, marginTop: 10, backgroundColor: '#f5f5f5', borderRadius: 5 },
  itemText: { fontSize: 18 },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 },
});
