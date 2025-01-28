import type React from "react"
import { useState, useEffect, useRef } from "react"
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Animated } from "react-native"

type MealRatingSliderProps = {
  meals: string[]
}

export const MealRatingSlider: React.FC<MealRatingSliderProps> = ({ meals }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [ratings, setRatings] = useState<Record<string, number>>({})
  const [remarks, setRemarks] = useState<Record<string, string>>({})
  const scrollX = useRef(new Animated.Value(0)).current

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % meals.length)
    }, 4000)

    return () => clearInterval(timer)
  }, [meals.length])

  useEffect(() => {
    Animated.spring(scrollX, {
      toValue: currentIndex * 300,
      useNativeDriver: true,
    }).start()
  }, [currentIndex, scrollX])

  const renderStars = (meal: string) => {
    return [...Array(5)].map((_, index) => (
      <TouchableOpacity key={index} onPress={() => setRatings((prev) => ({ ...prev, [meal]: index + 1 }))}>
        <Text style={[styles.star, index < (ratings[meal] || 0) ? styles.starFilled : {}]}>★</Text>
      </TouchableOpacity>
    ))
  }

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEnabled={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        contentOffset={{ x: currentIndex * 300, y: 0 }}
      >
        {meals.map((meal, index) => (
          <View key={meal} style={styles.slide}>
            <Text style={styles.ratingTitle}>Rate the Quality of {meal} today?</Text>
            <View style={styles.starsContainer}>{renderStars(meal)}</View>
            <TextInput
              style={styles.remarksInput}
              placeholder={`Enter ${meal.toLowerCase()} remarks here in short`}
              value={remarks[meal] || ""}
              onChangeText={(text) => setRemarks((prev) => ({ ...prev, [meal]: text }))}
              multiline
            />
          </View>
        ))}
      </Animated.ScrollView>
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
      <View style={styles.pagination}>
        {meals.map((_, index) => (
          <View key={index} style={[styles.paginationDot, currentIndex === index ? styles.paginationDotActive : {}]} />
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  scrollView: {
    width: 300,
  },
  scrollViewContent: {
    alignItems: "center",
  },
  slide: {
    width: 300,
    alignItems: "center",
  },
  ratingTitle: {
    fontSize: 18,
    fontWeight: "500",
    marginBottom: 12,
    textAlign: "center",
    color: "#333",
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  star: {
    fontSize: 36,
    color: "#ddd",
    marginHorizontal: 4,
  },
  starFilled: {
    color: "#FFD700",
  },
  remarksInput: {
    width: "100%",
    height: 80,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    textAlignVertical: "top",
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: "#01519A",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    elevation: 2,
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#01519A",
  },
})

