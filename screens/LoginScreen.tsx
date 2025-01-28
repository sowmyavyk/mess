import React, { useState } from "react"
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Image } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import DropDownPicker from "react-native-dropdown-picker"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../App"

// Update this import statement
import messLogo from "../assets/mess_logo.png"

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Login">

type Props = {
  navigation: LoginScreenNavigationProp
}

export default function LoginScreen({ navigation }: Props) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [rollNo, setRollNo] = useState("")
  const [password, setPassword] = useState("")

  const groups = [
    { label: "I.M.Tech", value: "I.M.Tech" },
    { label: "M.Tech", value: "M.Tech" },
    { label: "B.Tech", value: "B.Tech" },
    { label: "PhD", value: "PhD" },
    { label: "M.Sc. Digital Society", value: "M.Sc. Digital Society" },
    { label: "MS by Research", value: "MS by Research" },
    { label: "PGP DPDM", value: "PGP DPDM" },
    { label: "Faculty", value: "Faculty" },
  ]

  const handleNext = () => {
    if (selectedGroup) {
      navigation.navigate("Profile", {
        group: selectedGroup,
        rollNo,
        password,
      })
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          {/* Update the Image source to use the imported messLogo */}
          <Image source={messLogo} style={styles.logo} />
          <Text style={styles.title}>Mess Feedback Management</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Select your group</Text>
            <DropDownPicker
              open={open}
              value={selectedGroup}
              items={groups}
              setOpen={setOpen}
              setValue={setSelectedGroup}
              style={styles.picker}
              dropDownContainerStyle={styles.dropDownContainer}
              placeholder="Select your group"
              zIndex={3000}
              zIndexInverse={1000}
            />
          </View>

          <View style={[styles.inputContainer, { zIndex: open ? -1 : 1 }]}>
            <Text style={styles.label}>Enter Roll No</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter here"
              value={rollNo}
              onChangeText={setRollNo}
              autoCapitalize="none"
            />
          </View>

          <View style={[styles.inputContainer, { zIndex: open ? -1 : 1 }]}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter here"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={[styles.button, { zIndex: open ? -1 : 1 }]} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 149,
    height: 124,
    marginTop: 126,
    marginBottom: 20,
    resizeMode: "contain",
  },
  title: {
    width: 366,
    height: 29,
    fontSize: 20,
    fontWeight: "600",
    lineHeight: 29,
    textAlign: "center",
    color: "#01519A",
  },
  form: {
    width: "100%",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    lineHeight: 24,
    color: "#2D2D2D",
    marginBottom: 8,
  },
  picker: {
    borderColor: "#CBCBCB",
    borderRadius: 6,
    backgroundColor: "#FEFEFE",
  },
  dropDownContainer: {
    borderColor: "#CBCBCB",
    borderRadius: 6,
    backgroundColor: "#FEFEFE",
  },
  input: {
    height: 50,
    fontSize: 15,
    fontWeight: "500",
    color: "#595959",
    borderWidth: 1,
    borderColor: "#00000033",
    borderRadius: 6,
    paddingHorizontal: 12,
    backgroundColor: "#FFFFFF",
  },
  button: {
    width: 270,
    height: 44,
    backgroundColor: "#01519A",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
})

