import React, { useState } from 'react'
import { StyleSheet, Text, View } from "react-native";
import { Button } from 'react-native-paper';
import DragAndDrop from "volkeno-react-native-drag-drop";
import { ScrollView } from 'react-native-gesture-handler';

export const DragDropItems = () => {

    const [items, setItems] = useState([
        { id: 1, text: "Prototipo" },
        { id: 2, text: "Imagenes" },
        { id: 3, text: "Video" },
        { id: 4, text: "Obligatorio" },
        { id: 5, text: "Nombre" },
        { id: 6, text: "Descripcion" },
        { id: 7, text: "Atributo Y" },
        { id: 8, text: "Muestra" },
        { id: 9, text: "Kotlin" },
      ]);
      const [zones, setZones] = useState([
        {
          id: 1,
          text: "Elementos añadidos",
          items: [],
        },
      ]);

  return (
    <>
    <DragAndDrop
      style={styles.container}
      contentContainerStyle={styles.contentContainerStyle}
      itemKeyExtractor={(item) => item.id}
      zoneKeyExtractor={(zone) => zone.id}
      zones={zones}
      items={items}
      onMaj={(zones, items) => {
        setItems(items);
        setZones(zones);
      }}
      itemsInZoneDisplay="row"
      itemsDisplay="row"
      itemsNumCollumns={3}
      itemsInZoneNumCollumns={2}
      renderItem={(item) => {
        return (
          <View style={styles.dragItemStyle}>
            <Text style={styles.dragItemTextStyle}>{item.text}</Text>
          </View>
        );
      }}
      renderZone={(zone, children, hover) => {
        return (
          <View style={{ marginVertical: 10 }}>
            <Text style={{ marginBottom: 5 }}>{zone.text}</Text>
            <View
              style={{
                ...styles.dragZoneStyle,
                minHeight: 150,
                backgroundColor: hover ? "#E2E2E2" : "#FFF",
              }}
            >
              {children}
            </View>
          </View>
        );
      }}
    />
    {/* <Button
        style={{marginVertical: 15}}
        icon="send"
        mode="contained"
        buttonColor="#5C95FF"
        onPress={() => console.log(zones)}>
        Crear nuevo proyecto
      </Button> */}
    </>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainerStyle: {
      padding: 20,
      paddingTop: 40,
    },
    dragItemStyle: {
      borderColor: "#5C95FF",
      borderWidth: 1,
      borderRadius: 20,
      alignItems: "center",
      justifyContent: "center",
      marginVertical: 5,
      backgroundColor: "#F5F5F5",
      padding: 10,
    },
    dragItemTextStyle: {
      color: "#2F3061",
      fontWeight: "700",
      textAlign: "center",
    },
    dragZoneStyle: {
      borderColor: "#5C95FF",
      borderWidth: 1,
      padding: 15,
    },
  });
