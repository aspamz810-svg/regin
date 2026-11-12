import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';

import {
  MainComponent,
  PlanComponent,
  WorkoutComponent,
  ChallengeComponent,
  CameraComponent,
} from './src/components';
import PersonalizedPlanComponent from './src/components/PersonalizedPlanComponent';

type TabType = 'home' | 'workout' | 'progress' | 'profile';

const App = () => {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [workoutMode, setWorkoutMode] = useState<string>('main');
  const [repsCount, setRepsCount] = useState<number>(84);
  const [calories, setCalories] = useState<number>(480);
  const [waterIntake, setWaterIntake] = useState<number>(1750);

  // handle data from the kinestex sdk
  const handleMessage = (type: string, data: {[key: string]: any}) => {
    switch (type) {
      case 'finished_workout':
        console.log('Received data:', data);
        break;
      case 'kinestex_launched':
        console.log('KinesteX launched');
        break;
      case 'exit_kinestex':
        setActiveTab('home');
        break;
      case 'error_occured':
        console.log('Error occured:', data);
        break;
      default:
        if (data && data.reps) {
          setRepsCount(prev => prev + 1);
        }
        break;
    }
  };

  const startSpecificWorkout = (mode: string) => {
    setWorkoutMode(mode);
    setActiveTab('workout');
  };

  const renderWorkoutComponent = () => {
    switch (workoutMode) {
      case 'camera':
        return <CameraComponent onMessage={handleMessage} />;
      case 'challenge':
        return <ChallengeComponent onMessage={handleMessage} />;
      case 'plan':
        return <PlanComponent onMessage={handleMessage} />;
      case 'personalized-plan':
        return <PersonalizedPlanComponent onMessage={handleMessage} />;
      default:
        return <MainComponent onMessage={handleMessage} />;
    }
  };

  const renderHomeTab = () => (
    <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greetingText}>MONDAY, NOV 9</Text>
          <Text style={styles.userNameText}>Summary</Text>
        </View>
        <TouchableOpacity style={styles.avatarBtn} onPress={() => setActiveTab('profile')}>
          <Text style={styles.avatarText}>AJ</Text>
        </TouchableOpacity>
      </View>

      {/* Activity Card (Light Mode iOS Style) */}
      <View style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <Text style={styles.targetTitle}>ACTIVITY TARGETS</Text>
          <View style={styles.streakBadge}>
            <Text style={styles.streakText}>🔥 5 Day Streak</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statPill}>
            <Text style={[styles.statVal, {color: '#fa114f'}]}>{calories}</Text>
            <Text style={styles.statLbl}>Move (Cal)</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={[styles.statVal, {color: '#34c759'}]}>34</Text>
            <Text style={styles.statLbl}>Exercise (Min)</Text>
          </View>
          <View style={styles.statPill}>
            <Text style={[styles.statVal, {color: '#007aff'}]}>10</Text>
            <Text style={styles.statLbl}>Stand (Hrs)</Text>
          </View>
        </View>
      </View>

      {/* Water Intake Tracker */}
      <View style={styles.hydrationCard}>
        <View>
          <Text style={styles.hydrationTitle}>💧 Water Intake</Text>
          <Text style={styles.hydrationSub}>{waterIntake.toLocaleString()} ml / 2,500 ml</Text>
        </View>
        <TouchableOpacity
          style={styles.waterBtn}
          onPress={() => setWaterIntake(prev => prev + 250)}>
          <Text style={styles.waterBtnText}>+ 250ml</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Start AI Workout */}
      <TouchableOpacity
        style={styles.primaryBtn}
        onPress={() => startSpecificWorkout('main')}>
        <Text style={styles.primaryBtnText}>▶ Start AI Motion Workout</Text>
      </TouchableOpacity>

      <View style={styles.sectionTitleRow}>
        <Text style={styles.sectionTitle}>AI Form Workouts</Text>
        <TouchableOpacity onPress={() => setActiveTab('workout')}>
          <Text style={styles.sectionLink}>See all</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.workoutItem}
        onPress={() => startSpecificWorkout('camera')}>
        <View style={[styles.workoutIconBox, {backgroundColor: 'rgba(0, 122, 255, 0.12)'}]}>
          <Text style={styles.workoutIcon}>📷</Text>
        </View>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutItemTitle}>AI Form Correction (60 FPS)</Text>
          <Text style={styles.workoutItemSub}>Real-time joint angles & error analysis • 10m</Text>
        </View>
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.workoutItem}
        onPress={() => startSpecificWorkout('challenge')}>
        <View style={[styles.workoutIconBox, {backgroundColor: 'rgba(255, 149, 0, 0.12)'}]}>
          <Text style={styles.workoutIcon}>🏆</Text>
        </View>
        <View style={styles.workoutInfo}>
          <Text style={styles.workoutItemTitle}>Squat & Jumping Challenge</Text>
          <Text style={styles.workoutItemSub}>Global leaderboards • 5m</Text>
        </View>
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderWorkoutTab = () => (
    <View style={styles.workoutTabWrapper}>
      <View style={styles.workoutHeaderRow}>
        <Text style={styles.subHeaderText}>60 FPS HIGH-ACCURACY POSE ENGINE</Text>
        <View style={styles.chipsRow}>
          <TouchableOpacity
            style={[styles.chip, workoutMode === 'main' && styles.chipActive]}
            onPress={() => setWorkoutMode('main')}>
            <Text style={[styles.chipText, workoutMode === 'main' && styles.chipTextActive]}>Full</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, workoutMode === 'camera' && styles.chipActive]}
            onPress={() => setWorkoutMode('camera')}>
            <Text style={[styles.chipText, workoutMode === 'camera' && styles.chipTextActive]}>Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, workoutMode === 'challenge' && styles.chipActive]}
            onPress={() => setWorkoutMode('challenge')}>
            <Text style={[styles.chipText, workoutMode === 'challenge' && styles.chipTextActive]}>Challenge</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.chip, workoutMode === 'personalized-plan' && styles.chipActive]}
            onPress={() => setWorkoutMode('personalized-plan')}>
            <Text style={[styles.chipText, workoutMode === 'personalized-plan' && styles.chipTextActive]}>Plan</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.workoutContent}>
        {renderWorkoutComponent()}
      </View>
    </View>
  );

  const renderProgressTab = () => (
    <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greetingText}>ACTIVITY INSIGHTS</Text>
          <Text style={styles.userNameText}>Trends</Text>
        </View>
        <View style={styles.timeframeBadge}>
          <Text style={styles.timeframeText}>This Week</Text>
        </View>
      </View>

      <View style={styles.statsSummaryCard}>
        <View style={styles.summaryCol}>
          <Text style={[styles.summaryVal, {color: '#34c759'}]}>99%</Text>
          <Text style={styles.summaryLbl}>Accuracy</Text>
        </View>
        <View style={styles.vDivider} />
        <View style={styles.summaryCol}>
          <Text style={[styles.summaryVal, {color: '#007aff'}]}>1,920</Text>
          <Text style={styles.summaryLbl}>Calories</Text>
        </View>
        <View style={styles.vDivider} />
        <View style={styles.summaryCol}>
          <Text style={[styles.summaryVal, {color: '#ff9500'}]}>{repsCount}</Text>
          <Text style={styles.summaryLbl}>Reps</Text>
        </View>
      </View>

      <Text style={[styles.sectionTitle, {marginTop: 20}]}>Weekly Consistency</Text>
      <View style={styles.chartContainer}>
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, idx) => {
          const heights = [45, 70, 55, 85, 60, 96, 30];
          const isToday = idx === 5;
          return (
            <View key={day} style={styles.barCol}>
              <View
                style={[
                  styles.bar,
                  {height: `${heights[idx]}%`},
                  isToday && {backgroundColor: '#34c759'},
                ]}
              />
              <Text style={[styles.barDayText, isToday && {color: '#34c759', fontWeight: 'bold'}]}>
                {day}
              </Text>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderProfileTab = () => (
    <ScrollView style={styles.scrollContent} contentContainerStyle={styles.scrollInner}>
      <View style={styles.profileHeader}>
        <View style={styles.profileAvatarLarge}>
          <Text style={styles.profileAvatarLargeText}>AJ</Text>
        </View>
        <Text style={styles.userNameText}>Alex Johnson</Text>
        <Text style={styles.greetingText}>alex.johnson@icloud.com</Text>
      </View>

      <Text style={[styles.sectionTitle, {marginTop: 10}]}>Biometric Calibration (High Accuracy)</Text>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Height (cm)</Text>
        <TextInput style={styles.settingInput} defaultValue="175" />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Weight (kg)</Text>
        <TextInput style={styles.settingInput} defaultValue="70" />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Age</Text>
        <TextInput style={styles.settingInput} defaultValue="28" />
      </View>

      <Text style={[styles.sectionTitle, {marginTop: 20}]}>KinesteX SDK Integration</Text>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>API Key</Text>
        <TextInput style={styles.settingInput} defaultValue="YOUR_API_KEY" />
      </View>
      <View style={styles.settingItem}>
        <Text style={styles.settingLabel}>Company</Text>
        <TextInput style={styles.settingInput} defaultValue="YOUR_COMPANY" />
      </View>

      <TouchableOpacity style={[styles.primaryBtn, {marginTop: 16}]}>
        <Text style={styles.primaryBtnText}>Save & Calibrate Engine</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'workout':
        return renderWorkoutTab();
      case 'progress':
        return renderProgressTab();
      case 'profile':
        return renderProfileTab();
      default:
        return renderHomeTab();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#f2f2f7" />
      <View style={styles.container}>
        <View style={styles.screenBody}>{renderActiveScreen()}</View>

        {/* BOTTOM NAVIGATION BAR (LIGHT MODE) */}
        <View style={styles.bottomNavBar}>
          <TouchableOpacity style={styles.navTab} onPress={() => setActiveTab('home')}>
            <Text style={[styles.navIcon, activeTab === 'home' && styles.navIconActive]}>⭕</Text>
            <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>Summary</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navTab} onPress={() => setActiveTab('workout')}>
            <Text style={[styles.navIcon, activeTab === 'workout' && styles.navIconActive]}>🏋️</Text>
            <Text style={[styles.navText, activeTab === 'workout' && styles.navTextActive]}>Workout</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navTab} onPress={() => setActiveTab('progress')}>
            <Text style={[styles.navIcon, activeTab === 'progress' && styles.navIconActive]}>📈</Text>
            <Text style={[styles.navText, activeTab === 'progress' && styles.navTextActive]}>Trends</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.navTab} onPress={() => setActiveTab('profile')}>
            <Text style={[styles.navIcon, activeTab === 'profile' && styles.navIconActive]}>👤</Text>
            <Text style={[styles.navText, activeTab === 'profile' && styles.navTextActive]}>Sharing</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  container: {
    flex: 1,
    backgroundColor: '#f2f2f7',
  },
  screenBody: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  scrollInner: {
    padding: 16,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingText: {
    color: '#8e8e93',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  userNameText: {
    color: '#000000',
    fontSize: 32,
    fontWeight: 'bold',
  },
  avatarBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  activityCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  targetTitle: {
    color: '#8e8e93',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  streakBadge: {
    backgroundColor: 'rgba(255, 149, 0, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  streakText: {
    color: '#ff9500',
    fontSize: 11,
    fontWeight: '700',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statPill: {
    flex: 1,
    backgroundColor: '#f2f2f7',
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  statVal: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statLbl: {
    color: '#6c6c70',
    fontSize: 11,
    marginTop: 2,
  },
  hydrationCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#e0f2fe',
    borderRadius: 18,
    padding: 14,
    marginBottom: 14,
  },
  hydrationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0369a1',
  },
  hydrationSub: {
    fontSize: 12,
    color: '#0284c7',
    marginTop: 2,
  },
  waterBtn: {
    backgroundColor: '#007aff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  waterBtnText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  primaryBtn: {
    backgroundColor: '#34c759',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    marginVertical: 10,
  },
  primaryBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#000000',
    fontSize: 17,
    fontWeight: 'bold',
  },
  sectionLink: {
    color: '#007aff',
    fontSize: 14,
  },
  workoutItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
  },
  workoutIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workoutIcon: {
    fontSize: 20,
  },
  workoutInfo: {
    flex: 1,
  },
  workoutItemTitle: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
  },
  workoutItemSub: {
    color: '#8e8e93',
    fontSize: 12,
    marginTop: 2,
  },
  arrowText: {
    color: '#aeaeb2',
    fontSize: 18,
  },
  workoutTabWrapper: {
    flex: 1,
  },
  workoutHeaderRow: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 6,
    backgroundColor: '#ffffff',
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(60, 60, 67, 0.12)',
  },
  subHeaderText: {
    color: '#8e8e93',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 6,
  },
  chipsRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  chip: {
    backgroundColor: '#f2f2f7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 8,
  },
  chipActive: {
    backgroundColor: '#007aff',
  },
  chipText: {
    color: '#6c6c70',
    fontSize: 12,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#fff',
  },
  workoutContent: {
    flex: 1,
  },
  timeframeBadge: {
    backgroundColor: 'rgba(0, 122, 255, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  timeframeText: {
    color: '#007aff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsSummaryCard: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
  },
  summaryVal: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  summaryLbl: {
    color: '#8e8e93',
    fontSize: 11,
    marginTop: 2,
  },
  vDivider: {
    width: 0.5,
    backgroundColor: 'rgba(60, 60, 67, 0.14)',
  },
  chartContainer: {
    flexDirection: 'row',
    height: 120,
    alignItems: 'flex-end',
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 14,
    marginTop: 8,
  },
  barCol: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: 18,
    borderRadius: 4,
    backgroundColor: '#e5e5ea',
    marginBottom: 6,
  },
  barDayText: {
    color: '#8e8e93',
    fontSize: 10,
  },
  profileHeader: {
    alignItems: 'center',
    marginVertical: 16,
  },
  profileAvatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#007aff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileAvatarLargeText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 14,
    borderRadius: 14,
    marginBottom: 6,
  },
  settingLabel: {
    color: '#000000',
    fontSize: 15,
  },
  settingInput: {
    color: '#007aff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    textAlign: 'right',
    fontSize: 15,
    fontWeight: '500',
  },
  bottomNavBar: {
    flexDirection: 'row',
    height: 64,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(60, 60, 67, 0.14)',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navIcon: {
    fontSize: 18,
    opacity: 0.5,
  },
  navIconActive: {
    opacity: 1,
  },
  navText: {
    color: '#8e8e93',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  navTextActive: {
    color: '#007aff',
    fontWeight: '600',
  },
});

export default App;
