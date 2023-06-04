import { Box, Button, Divider, ListItem } from "@react-native-material/core";
import { Audio } from "expo-av";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";
import {NotionPageDropdown} from "./NotionPageDropDown";

const client = new QueryClient();

export default function App() {
  const [recording, setRecording] = useState(null);

  async function startRecording() {
    try {
      console.log("Requesting permissions..");
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      console.log("Starting recording..");
      const { recording } = await Audio.Recording.createAsync();
      setRecording(recording);
      console.log("Recording started");
    } catch (err) {
      console.error("Failed to start recording", err);
    }
  }

  async function stopRecording() {
    console.log("Stopping recording..");
    setRecording(undefined);
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    console.log("Recording stopped and stored at", uri);
    await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
  }

  return (
    <QueryClientProvider client={client}>
      <View style={styles.container}>
        <Box w="100%" h="5%" m={10}>
          <Text style={styles.title}>Notion Voice Memo</Text>
        </Box>
        <NotionPageDropdown />
        <Box w="100%" h="65%" mt={20}>
          <Divider leadingInset={15} />
          <ListItem title="List Item" />
          <ListItem title="List Item" />
          <ListItem title="List Item" />
        </Box>
        <Box w="100%" h="20%" p={10}>
          <Button
            style={styles.button}
            title=<Text style={styles.buttonText}>
              {recording ? "Stop Recording" : "Start Recording"}
            </Text>
            color={recording ? "#FF7369" : "#4282EF"}
            onPress={recording ? stopRecording : startRecording}
          />
        </Box>
        <StatusBar style="auto" />
      </View>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: "10%",
    padding: "1%",
  },
  title: {
    fontWeight: "bold",
    fontSize: 30,
  },
  button: {
    borderStyle: "solid",
    borderWidth: 0.3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
