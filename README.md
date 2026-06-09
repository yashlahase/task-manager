# TaskFlow 🚀

TaskFlow is a premium, fully-typed React Native Task Management Application built using Expo and TypeScript. It offers an offline-first task tracker experience featuring local authentication, task CRUD, search/filtering/sorting, and a detailed statistics dashboard—designed to run cleanly inside Expo Go.

## 📱 Features

- **Authentication Screen**: Secure local login validation (email structure checks, password length minimum 6 characters) with persistent session state.
- **Task Dashboard**: Renders all tasks in an interactive feed. Support for toggling status (Pending/Completed), creating, editing, and deleting tasks.
- **Create/Edit Form**: Reusable task composer featuring inline field validations, priority picker sheet, and date picker modal.
- **Advanced Filtering, Search, & Sorting**:
  - Live search by task title.
  - Quick filter chips by Completion Status (All, Pending, Completed) and Priority Levels (All, High, Medium, Low).
  - Sort tasks dynamically by Due Date (Oldest first / Newest first).
- **Statistics Dashboard**: Visual breakdown of total, pending, completed, and high-priority tasks (without external chart libraries) using responsive indicator cards and progress bars.
- **Offline Data Persistence**: Complete local storage management for auth states and tasks using `AsyncStorage`.
- **Aesthetic UI/UX**: Premium modern dark layout, custom interactive overlays, touchable transitions, and pull-to-refresh list integration.

---

## 📂 Folder Structure

```
src/
├── components/     # Reusable UI controls (AppButton, AppInput, TaskCard, StatCard, etc.)
├── screens/        # Primary views (LoginScreen, DashboardScreen, AddEditTaskScreen, StatisticsScreen)
├── navigation/     # React Navigation configuration (RootNavigator, TabNavigator)
├── hooks/          # Custom hooks encapsulating state & logic (useAuth, useTasks)
├── storage/        # Local Storage drivers (authStorage, taskStorage)
├── services/       # Mock services or utilities
├── context/        # React Context providers (AuthContext, TaskContext)
├── types/          # Shared TypeScript type definitions
├── constants/      # App constants (Colors, Typography)
└── utils/          # Helper modules and validation scripts
```

---

## 🛠️ Architecture Explanation

TaskFlow separates concerns cleanly into modular layers:
- **Presentation Layer**: Functional components located in `src/components` and `src/screens` are styled using StyleSheet. They consume context states via custom hooks and emit user interaction events.
- **State & Logic Layer**: Managed by React Context API (`AuthContext`, `TaskContext`) and encapsulated within custom hooks (`useAuth`, `useTasks`). This separates business calculations, searching, sorting, and filtering from visual components. Filters and sorting operations utilize `useMemo` to keep renders performant.
- **Storage Layer**: Handled asynchronously by `authStorage` and `taskStorage` using `AsyncStorage` to store raw strings and serializable JSON arrays securely.
- **Navigation Layer**: The entry point `App.tsx` configures a `NavigationContainer` holding a `RootNavigator`. If the user is unauthenticated, they are gated to the `LoginScreen`. Once signed in, they gain access to the bottom tab bar (`TabNavigator`) and stack routes.

---

## 🚀 Installation & Setup

Follow these commands to clone, install, and run the project:

### 1. Initialize & Install Dependencies
If you are starting from scratch, create an Expo app and install dependencies as follows:
```bash
# Initialize a typescript expo project
npx create-expo-app@latest TaskFlow --template blank-typescript

# Navigate into the project folder
cd TaskFlow

# Install React Navigation, AsyncStorage, and Expo modules
npx expo install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack react-native-safe-area-context react-native-screens @react-native-async-storage/async-storage @react-native-community/datetimepicker @expo/vector-icons
```

*Note: In this repository, the project is already initialized with all dependencies installed. You only need to run the install command to restore `node_modules`:*
```bash
npm install
```

### 2. Running the Project with Expo Go
To start the development server, run:
```bash
npm run start
```

This starts the Expo CLI. You can then launch the application:
- **Android**: Scan the QR code displayed in the terminal using the Expo Go app on your phone, or press `a` to run in an Android emulator.
- **iOS**: Scan the QR code with your native Camera app (directing to Expo Go), or press `i` to run in the iOS Simulator.

### 3. Verification & Types Check
To run static type analysis and verify syntax correctness:
```bash
npx tsc --noEmit
```

---

## 📦 Build Instructions

To generate a standalone distribution bundle or build binaries for app stores, utilize Expo Application Services (EAS):

```bash
# 1. Install EAS CLI globally
npm install -g eas-cli

# 2. Login to your Expo account
eas login

# 3. Initialize EAS configuration
eas build:configure

# 4. Trigger build for Android/iOS
eas build --platform all
```
*Note: Standalone builds require an Expo account and credentials setup.*
