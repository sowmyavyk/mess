import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Alert } from "react-native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { RouteProp } from "@react-navigation/native";
import type { RootStackParamList } from "../App";
import { BellIcon } from "../components/BellIcon";
import { ProfileIcon } from "../components/ProfileIcon";
import { FoodIcon } from "../components/FoodIcon";

const PROFILE_API_BASE = "https://iiitbhms.onrender.com/user/profile";

// Define interface for API response
interface UserProfile {
  id: number;
  group: string;
  rollNumber: string;
  name: string;
  password: string;
}

function handleApiError(error: unknown) {
  console.error("API Error:", error);
  Alert.alert("Error", "Something went wrong. Please try again.");
}

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Profile">;
type ProfileScreenRouteProp = RouteProp<RootStackParamList, "Profile">;

type Props = {
  navigation: ProfileScreenNavigationProp;
  route: ProfileScreenRouteProp;
};

export default function ProfileScreen({ navigation, route }: Props) {
  // Initialize state with route params
  const { group, rollNo, password } = route.params;
  const [studentName, setStudentName] = useState("");
  const [groupValue, setGroupValue] = useState(group);
  const [rollNumberValue, setRollNumberValue] = useState(rollNo);
  const [passwordValue, setPasswordValue] = useState(password);
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    // Fetch user profile data
    fetch(`${PROFILE_API_BASE}/${rollNo}/${group}`, {
      method: "GET",
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }
        return response.json();
      })
      .then((data: UserProfile) => {
        if (data) {
          setStudentName(data.name);
          setGroupValue(data.group);
          setRollNumberValue(data.rollNumber);
          setPasswordValue(data.password);
          setUserId(data.id);
        }
      })
      .catch(handleApiError);
  }, [rollNo, group]);

  const handleSave = () => {
    const updatedData = {
      id: userId,  // Include the user ID in the update
      rollNumber: rollNumberValue,
      group: groupValue,
      name: studentName,
      password: passwordValue,
    };

    fetch(`${PROFILE_API_BASE}/update`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    })
      .then(async response => {
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage || "Failed to update profile");
        }
        return response.json();
      })
      .then(data => {
        console.log("Update Response:", data);
        Alert.alert("Success", "Profile updated successfully!");
      })
      .catch(error => {
        console.error("Update Error:", error);
        Alert.alert("Error", error.message || "Something went wrong. Please try again.");
      });
  };
  
return (
<SafeAreaView style={styles.container}>
<View style={styles.header}>
<TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
<Text style={styles.headerIcon}>←</Text>
</TouchableOpacity>
<Text style={styles.headerTitle}>Mess card</Text>
<TouchableOpacity style={styles.notificationButton}>
<BellIcon size={28} />
</TouchableOpacity>
</View>

<ScrollView style={styles.content}>
<Text style={styles.title}>Profile Card</Text>

<View style={styles.card}>
<View style={styles.imageUpload}>
<View style={styles.imagePlaceholder}>
<Text style={styles.imagePlaceholderText}>👤</Text>
</View>
<Text style={styles.uploadText}>Upload your image</Text>
</View>

<View style={styles.formGroup}>
<Text style={styles.label}>Student Name</Text>
<TextInput
style={styles.input}
placeholder="Enter here"
value={studentName}
onChangeText={setStudentName}
/>
</View>

<View style={styles.formGroup}>
<Text style={styles.label}>Group</Text>
<TextInput
style={styles.input}
value={groupValue}
onChangeText={setGroupValue}
/>
</View>

<View style={styles.formGroup}>
<Text style={styles.label}>Roll No</Text>
<TextInput
style={styles.input}
value={rollNumberValue}
onChangeText={setRollNumberValue}
/>
</View>

<View style={styles.formGroup}>
<Text style={styles.label}>Password</Text>
<TextInput
style={styles.input}
value={passwordValue}
secureTextEntry
onChangeText={setPasswordValue}
/>
</View>

<View style={styles.mealStatus}>
<View style={styles.mealRow}>
<Text style={styles.mealType}>Breakfast</Text>
<Text style={styles.mealDivider}>:</Text>
<Text style={styles.marked}>Marked</Text>
</View>
<View style={styles.mealRow}>
<Text style={styles.mealType}>Lunch</Text>
<Text style={styles.mealDivider}>:</Text>
<Text style={styles.marked}>Marked</Text>
</View>
<View style={styles.mealRow}>
<Text style={styles.mealType}>Snacks</Text>
<Text style={styles.mealDivider}>:</Text>
<Text style={styles.marked}>Marked</Text>
</View>
<View style={styles.mealRow}>
<Text style={styles.mealType}>Dinner</Text>
<Text style={styles.mealDivider}>:</Text>
<Text style={styles.notMarked}>Not Marked</Text>
</View>
</View>
</View>

<TouchableOpacity style={styles.saveButton} onPress={handleSave}>
<Text style={styles.saveButtonText}>Save</Text>
</TouchableOpacity>

<TouchableOpacity
style={styles.goToFoodButton}
onPress={() => navigation.navigate("Food", { rollNo: rollNumberValue })}
>
<Text style={styles.goToFoodButtonText}>Go to Food Screen</Text>
</TouchableOpacity>

<View style={styles.footer}>
<Text style={styles.footerText}>made with ❤️</Text>
<Text style={styles.footerSubtext}>Crafted in Bengaluru</Text>
</View>
</ScrollView>

<View style={styles.bottomNav}>
<TouchableOpacity style={styles.navItem}>
<ProfileIcon color="#01519A" size={28} />
<Text style={styles.navText}>Profile</Text>
</TouchableOpacity>
<TouchableOpacity style={styles.navItem} onPress={() => navigation.navigate("Food", { rollNo: rollNumberValue })}>
<FoodIcon color="#666" size={28} />
<Text style={[styles.navText, styles.navTextInactive]}>Food</Text>
</TouchableOpacity>
</View>
</SafeAreaView>
);
}

const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: "#fff",
},
header: {
flexDirection: "row",
alignItems: "center",
backgroundColor: "#01519A",
padding: 16,
paddingTop: 20,
},
backButton: {
padding: 8,
marginRight: 8,
},
headerIcon: {
color: "#fff",
fontSize: 28,
},
headerTitle: {
flex: 1,
color: "#fff",
fontSize: 20,
fontWeight: "600",
},
notificationButton: {
padding: 8,
},
content: {
flex: 1,
},
title: {
fontSize: 24,
fontWeight: "600",
color: "#01519A",
textAlign: "center",
marginVertical: 24,
},
card: {
backgroundColor: "#89B9E6",
borderRadius: 12,
margin: 16,
padding: 16,
},
imageUpload: {
alignItems: "center",
marginBottom: 24,
},
imagePlaceholder: {
width: 80,
height: 80,
borderRadius: 40,
backgroundColor: "#fff",
justifyContent: "center",
alignItems: "center",
marginBottom: 8,
},
imagePlaceholderText: {
fontSize: 40,
},
uploadText: {
color: "#666",
fontSize: 14,
},
formGroup: {
marginBottom: 16,
},
label: {
fontSize: 14,
color: "#333",
marginBottom: 4,
},
input: {
backgroundColor: "#fff",
borderRadius: 4,
padding: 8,
fontSize: 14,
},
mealStatus: {
marginTop: 24,
width: "100%",
paddingHorizontal: 16,
},
mealRow: {
flexDirection: "row",
marginBottom: 16,
alignItems: "center",
justifyContent: "space-between",
},
mealType: {
fontSize: 16,
fontWeight: "600",
color: "#333",
flex: 1,
},
mealDivider: {
fontSize: 16,
color: "#333",
marginHorizontal: 16,
},
marked: {
fontSize: 16,
fontWeight: "600",
color: "#333",
flex: 1,
textAlign: "left",
},
notMarked: {
fontSize: 16,
fontWeight: "600",
color: "#666",
flex: 1,
textAlign: "left",
},
saveButton: {
backgroundColor: "#01519A",
borderRadius: 8,
width: 270,
height: 44.73,
justifyContent: "center",
alignItems: "center",
alignSelf: "center",
marginTop: 16,
},
saveButtonText: {
color: "#fff",
fontSize: 16,
fontWeight: "600",
},
goToFoodButton: {
backgroundColor: "#01519A",
borderRadius: 8,
padding: 10,
marginVertical: 16,
alignSelf: "center",
},
goToFoodButtonText: {
color: "#fff",
fontSize: 16,
fontWeight: "600",
textAlign: "center",
},
footer: {
alignItems: "center",
marginVertical: 24,
backgroundColor: "#fff",
padding: 16,
borderTopWidth: 1,
borderTopColor: "#ddd",
},
footerText: {
fontSize: 16,
color: "#333",
marginBottom: 4,
},
footerSubtext: {
fontSize: 14,
color: "#666",
},
bottomNav: {
flexDirection: "row",
borderTopWidth: 1,
borderTopColor: "#eee",
paddingVertical: 12,
backgroundColor: "#fff",
},
navItem: {
flex: 1,
alignItems: "center",
justifyContent: "center",
},
navText: {
fontSize: 12,
color: "#01519A",
marginTop: 4,
},
navTextInactive: {
color: "#666",
},
});
