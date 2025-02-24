import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  TextInput,
  Dimensions,
  Alert,
} from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { BellIcon } from "../components/BellIcon";
import { ProfileIcon } from "../components/ProfileIcon";
import { FoodIcon } from "../components/FoodIcon";
import ratingImage from "../assets/rating-image.png";
import axios from "axios";

type RootStackParamList = {
  Food: { rollNo: string };
  Profile: { group: string; rollNo: string; password: string };
};

type FoodScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, "Food">;

type Props = {
  navigation: FoodScreenNavigationProp;
  route: { params: { rollNo: string } };
};

interface MenuItem {
  id: number;
  dayOfWeek: string;
  mealType: string;
  menuItems: string;
  date: string;
}

const { width } = Dimensions.get("window");

export default function FoodScreen({ navigation, route }: Props) {
  const [messOffFrom, setMessOffFrom] = useState("");
  const [messOffTo, setMessOffTo] = useState("");
  const [activeMeal, setActiveMeal] = useState<string | null>(null);
  const [menuData, setMenuData] = useState<MenuItem[]>([]);
  const { rollNo } = route.params;

  const meals = ["Breakfast", "Lunch", "Snacks", "Dinner"];
  const mealTimes = {
    Breakfast: { start: 7, end: 10 },
    Lunch: { start: 11, end: 15 },
    Snacks: { start: 15, end: 18 },
    Dinner: { start: 18, end: 23 },
  };

  useEffect(() => {
    checkCurrentMeal();
    fetchTodayMenu();
    const interval = setInterval(checkCurrentMeal, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchTodayMenu = async () => {
    try {
      const response = await axios.get('https://messmanagement-2if9.onrender.com/menu/today');
      setMenuData(response.data);
    } catch (error) {
      console.error('Error fetching menu:', error);
      Alert.alert('Error', 'Failed to fetch today\'s menu');
    }
  };

  const getMenuItems = (mealType: string) => {
    const meal = menuData.find(item => item.mealType === mealType.toUpperCase());
    return meal ? meal.menuItems : 'Menu not available';
  };

  const checkCurrentMeal = () => {
    const currentHour = new Date().getHours();
    const currentMeal = meals.find((meal) => {
      const timeSlot = mealTimes[meal as keyof typeof mealTimes];
      return currentHour >= timeSlot.start && currentHour < timeSlot.end;
    });
    setActiveMeal(currentMeal || null);
  };

  const MealRatingCard = ({ meal, rollNo }: { meal: string; rollNo: string }) => {
    const [mealRating, setMealRating] = useState(0);
    const [mealFeedback, setMealFeedback] = useState("");
    const [hasRatedMeal, setHasRatedMeal] = useState(false);
    const [currentDate] = useState(new Date().toISOString().split("T")[0]); // Get current date in YYYY-MM-DD format
  
    const timeSlot = mealTimes[meal as keyof typeof mealTimes];
    const currentHour = new Date().getHours();
    const isActive = currentHour >= timeSlot.start && currentHour < timeSlot.end;
  
    useEffect(() => {
      const checkExistingRating = async () => {
        try {
          const response = await axios.get(
            "https://food-rating-p3l3.onrender.com/ratings/check",
            {
              params: {
                rollNumber: rollNo,
                mealType: meal,
                date: currentDate,
              },
            }
          );
          setHasRatedMeal(response.data.hasRated);
        } catch (error) {
          console.error("Error checking existing rating:", error);
        }
      };
  
      checkExistingRating();
    }, [meal, rollNo, currentDate]);
  
    const handleMealSubmit = async () => {
      if (mealRating === 0) {
        Alert.alert("Invalid Rating", "Please select a rating before submitting.");
        return;
      }
  
      try {
        await axios.post("https://food-rating-p3l3.onrender.com/ratings/submit", {
          rollNumber: rollNo,
          mealType: meal,
          rating: mealRating,
          feedback: mealFeedback,
          date: currentDate, // Include current date with submission
        });
        Alert.alert("Success", `${meal} rating submitted successfully!`);
        setMealRating(0);
        setMealFeedback("");
        setHasRatedMeal(true);
      } catch (error) {
        Alert.alert("Error", "Failed to submit rating. Please try again.");
      }
    };  

    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.mealTitle}>{meal}</Text>
        <Text style={styles.timeSlotText}>
          Rating available from {timeSlot.start}:00 to {timeSlot.end}:00
        </Text>
        <View style={styles.ratingStars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setMealRating(star)}
              style={styles.starButton}
              disabled={!isActive || hasRatedMeal}
            >
              <Text style={[ 
                styles.star, 
                mealRating >= star && styles.starSelected,
                (!isActive || hasRatedMeal) && styles.starDisabled
              ]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TextInput
          style={[styles.feedbackInput, (!isActive || hasRatedMeal) && styles.disabledInput]}
          placeholder={isActive ? "Share your feedback..." : "Feedback closed for this meal"}
          value={mealFeedback}
          onChangeText={setMealFeedback}
          multiline
          editable={isActive && !hasRatedMeal}
        />
        <TouchableOpacity
          style={[styles.submitButton, (!isActive || hasRatedMeal) && styles.submitButtonDisabled]}
          onPress={handleMealSubmit}
          disabled={!isActive || hasRatedMeal}
        >
          <Text style={styles.submitButtonText}>
            {hasRatedMeal ? "Already Rated" : isActive ? "Submit Rating" : "Rating Closed"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.submitButton, (!isActive || hasRatedMeal) && styles.submitButtonDisabled]}
          onPress={handleMealSubmit}
          disabled={!isActive || hasRatedMeal}
        >
          <Text style={styles.submitButtonText}>
            {hasRatedMeal ? "Already Rated" : isActive ? "Submit Rating" : "Rating Closed"}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

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

          <ScrollView horizontal={true} style={styles.horizontalScroll}>
            {meals.map((meal) => (
              <MealRatingCard key={meal} meal={meal} rollNo={rollNo} />
            ))}
          </ScrollView>

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
                  {getMenuItems(meal)}
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
            NOTE: You need to update your mess off status a day in advance if you plan to move
            outside. You can get skip meal credit only if you update your mess off status before
            everyone by default. For Today; Punch 5 hrs before the serving food.
          </Text>
          <Text style={styles.noteSubtext}>
            Be honest with your ratings, this will help all our community.
          </Text>

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
  );
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
  horizontalScroll: {
    marginBottom: 16,
  },
  ratingContainer: {
    width: width * 0.7,
    marginRight: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
  },
  mealTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#01519A",
    marginBottom: 16,
    textAlign: "center",
  },
  timeSlotText: {
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
    fontSize: 14,
  },
  ratingStars: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  starButton: {
    padding: 8,
  },
  star: {
    fontSize: 32,
    color: "#DDD",
  },
  starSelected: {
    color: "#FFD700",
  },
  starDisabled: {
    color: '#EEE',
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  disabledInput: {
    backgroundColor: '#F5F5F5',
    borderColor: '#EEE',
  },
  submitButton: {
    backgroundColor: "#01519A",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
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
});