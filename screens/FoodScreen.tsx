import React, { useState } from "react"
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, SafeAreaView, Image } from "react-native"
import type { NativeStackNavigationProp } from "@react-navigation/native-stack"
import type { RootStackParamList } from "../App"
import { MealRatingSlider } from "../components/MealRatingSlider"
import { BellIcon } from "../components/BellIcon"
import { ProfileIcon } from "../components/ProfileIcon"
import { FoodIcon } from "../components/FoodIcon"
import ratingImage from "../assets/rating-image.png"

type FoodScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Food">

type Props = {
  navigation: FoodScreenNavigationProp
}

export default function FoodScreen({ navigation }: Props) {
  const [messOffFrom, setMessOffFrom] = useState("")
  const [messOffTo, setMessOffTo] = useState("")

  const meals = ["Breakfast", "Lunch", "Snacks", "Dinner"]

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Menu</Text>
        <TouchableOpacity style={styles.notificationButton}>
          <BellIcon size={28} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.sectionTitleContainer}>
            <Text style={styles.sectionTitle}>Today's Menu Specials</Text>
          </View>
          <Image source={ratingImage} style={styles.ratingImage} />
          <MealRatingSlider meals={meals} />

          <View style={styles.menuList}>
            {meals.map((meal, index) => (
              <View key={meal} style={styles.menuItem}>
                <View style={styles.menuHeader}>
                  <Text style={styles.menuTitle}>{meal}</Text>
                  <Text style={styles.menuTime}>
                    {index === 0
                      ? "07:30-9:45 AM"
                      : index === 1
                        ? "12:30-2:15 PM"
                        : index === 2
                          ? "04:30-5:45 PM"
                          : "7:30-9:30 PM"}
                  </Text>
                </View>
                <Text style={styles.menuDescription}>
                  {index === 0
                    ? "Aloo parathe, Dahi and chai"
                    : index === 1 || index === 2
                      ? "Rajma, Roti, Rice, Salad and Dahi"
                      : "Mix Veg, Dal, Roti, and Rice"}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.messOffSection}>
            <Text style={styles.messOffTitle}>Mess off</Text>
            <View style={styles.messOffInputs}>
              <View style={styles.dateInput}>
                <Text style={styles.dateLabel}>From</Text>
                <TextInput
                  style={styles.dateTextInput}
                  placeholder="DD/MM/YYYY"
                  value={messOffFrom}
                  onChangeText={setMessOffFrom}
                />
              </View>
              <View style={styles.dateInput}>
                <Text style={styles.dateLabel}>To</Text>
                <TextInput
                  style={styles.dateTextInput}
                  placeholder="DD/MM/YYYY"
                  value={messOffTo}
                  onChangeText={setMessOffTo}
                />
              </View>
              <TouchableOpacity style={styles.confirmButton}>
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.note}>
            NOTE: You need to update your mess off status a day in advance if you plan to move outside. You can get skip
            meal credit only if you update your mess off status before everyone by default. For Today; Punch 5 hrs
            before the serving food.
          </Text>
          <Text style={styles.noteSubtext}>Be honest with your ratings, this will help all our community.</Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>made with ❤️</Text>
            <Text style={styles.footerSubtext}>Crafted in Bengaluru</Text>
            <Text style={styles.footerDevelopedBy}>Developed at</Text>
            <Text style={styles.footerCompany}>IIITB Innovation Center</Text>
            <Text style={styles.footerCompany}>ThinkLogic Tech Solutions Pvt.Ltd</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => navigation.navigate("Profile", { group: "", rollNo: "", password: "" })}
        >
          <ProfileIcon color="#666" size={28} />
          <Text style={[styles.navText, styles.navTextInactive]}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <FoodIcon color="#01519A" size={28} />
          <Text style={styles.navText}>Food</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8", 
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
    padding: 16,
  },
  menuList: {
    marginBottom: 16,
  },
  menuItem: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  menuHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#01519A",
  },
  menuTime: {
    color: "#666",
    fontSize: 14,
  },
  menuDescription: {
    color: "#333",
    fontSize: 16,
  },
  messOffSection: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  messOffTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#01519A",
    marginBottom: 16,
  },
  messOffInputs: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  dateInput: {
    flex: 1,
  },
  dateLabel: {
    marginBottom: 4,
    color: "#666",
    fontSize: 14,
  },
  dateTextInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    height: 48,
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#01519A",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    height: 48,
    justifyContent: "center",
    elevation: 2,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  note: {
    padding: 16,
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 12,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  noteSubtext: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  footer: {
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F0F4F8",
    borderTopWidth: 1,
    borderTopColor: "#E0E4E8",
    marginTop: 16,
  },
  footerText: {
    fontSize: 18,
    marginBottom: 4,
    color: "#333",
  },
  footerSubtext: {
    fontSize: 16,
    color: "#666",
    marginBottom: 16,
  },
  footerDevelopedBy: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  footerCompany: {
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
  ratingImage: {
    width: 140,
    height: 140,
    alignSelf: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#01519A",
    marginBottom: 20,
  },
  sectionTitleContainer: {
    alignItems: "flex-start",
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 32,
  },
})

