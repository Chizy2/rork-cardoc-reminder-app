# Cardan - Vehicle Document Management App
## Complete Technical Documentation

---

## Table of Contents
1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Features](#features)
4. [Technology Stack](#technology-stack)
5. [Project Structure](#project-structure)
6. [Data Models](#data-models)
7. [State Management](#state-management)
8. [Authentication & User Management](#authentication--user-management)
9. [Core Functionality](#core-functionality)
10. [Backend Integration](#backend-integration)
11. [Subscription System](#subscription-system)
12. [UI/UX Design](#uiux-design)
13. [Installation & Setup](#installation--setup)
14. [API Reference](#api-reference)
15. [Deployment](#deployment)

---

## Overview

**Cardan** is a comprehensive mobile application for managing vehicle documents, tracking expiry dates, setting reminders, and facilitating document renewals. The app helps users stay compliant with vehicle documentation requirements by providing automated tracking, notifications, and renewal services.

### Key Capabilities
- Multi-vehicle document management
- Automated expiry tracking with status indicators
- Custom reminder system with completion tracking
- AI-powered vehicle diagnostic assistant
- Document renewal service integration
- Subscription-based premium features
- Document history and versioning
- Cross-platform support (iOS, Android, Web)

---

## Architecture

### Application Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                     React Native App                         │
│                    (Expo Framework)                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   UI Layer   │  │  State Mgmt  │  │   Backend    │      │
│  │  (Screens)   │  │  (Context)   │  │   (tRPC)     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┴──────────────────┘              │
│                           │                                  │
│                  ┌────────▼────────┐                         │
│                  │  AsyncStorage   │                         │
│                  │  (Local Data)   │                         │
│                  └─────────────────┘                         │
└─────────────────────────────────────────────────────────────┘
```

### Navigation Structure
```
Root (_layout.tsx)
├── (auth)
│   ├── login.tsx
│   └── signup.tsx
├── welcome.tsx
├── onboarding.tsx
├── (tabs)
│   ├── home.tsx
│   ├── vehicles.tsx
│   ├── reminders.tsx
│   ├── ai-assistant.tsx
│   └── profile.tsx
├── vehicle/[id].tsx
├── add-vehicle.tsx
├── edit-vehicle.tsx
├── add-document.tsx
├── add-reminder.tsx
├── edit-reminder.tsx
├── document-history/[id].tsx
└── renewal.tsx
```

---

## Features

### 1. Vehicle Management
- **Add Multiple Vehicles**: Support for cars, trucks, bikes, buses, and other vehicle types
- **Vehicle Details**: Store make, model, year, registration number, and photos
- **Edit & Delete**: Full CRUD operations on vehicle records
- **Search Functionality**: Quick search across all vehicles
- **Vehicle Cards**: Visual representation with document status overview

### 2. Document Management
- **Document Types**:
  - Insurance
  - License
  - Roadworthiness Certificate
  - Emission Certificate
  - Registration
  - Custom document types
- **Expiry Tracking**: Automatic status calculation (Valid, Expiring, Expired)
- **Document Images**: Capture or upload document photos
- **Document History**: Version control for renewed documents
- **Bulk Operations**: Manage multiple documents per vehicle
- **Search & Filter**: Find documents quickly

### 3. Reminder System
- **Custom Reminders**: Create reminders for any maintenance or renewal task
- **Reminder Types**:
  - Maintenance
  - Insurance renewal
  - Registration renewal
  - Service appointments
  - Oil changes
  - Tire rotation
  - Custom reminders
- **Date & Time**: Schedule reminders with specific dates and times
- **Completion Tracking**: Mark reminders as complete with history
- **Reminder History**: Track completed reminders over time
- **Active/History Toggle**: View active reminders or completed history

### 4. AI Vehicle Assistant
- **Diagnostic Chat**: AI-powered vehicle problem diagnosis
- **Vehicle Context**: Select specific vehicle for targeted assistance
- **Interactive Conversation**: Multi-turn conversations for detailed diagnosis
- **Problem Analysis**: Get insights on vehicle issues
- **Mock AI Service**: Currently uses simulated responses (ready for real AI integration)

### 5. Document Renewal Service
- **Renewal Request Form**:
  - City selection
  - Vehicle selection from registered vehicles
  - Document type selection with pricing
  - Paper type specification
- **Pricing Estimates**: Display estimated costs for different document types
- **WhatsApp Integration**: Direct communication with renewal service via WhatsApp
- **Pre-filled Messages**: Automatic message generation with all details

### 6. Subscription Management
- **Trial Period**: 14-day free trial for new users
- **Premium Plans**:
  - 3 Months: ₦7,500 (₦2,500/month)
  - 6 Months: ₦12,000 (₦2,000/month) - Save ₦3,000
  - 12 Months: ₦20,000 (₦1,666.67/month) - Save ₦10,000
- **Subscription Features**:
  - Unlimited vehicles
  - Unlimited documents
  - AI assistant access
  - Priority renewal service
  - Document history tracking
- **Subscription Gates**: Feature restrictions for non-premium users
- **Expiry Tracking**: Automatic subscription status updates

### 7. User Profile
- **Profile Management**:
  - Name, email, phone
  - Profile photo (camera or gallery)
  - Subscription status display
- **Statistics Dashboard**:
  - Total vehicles
  - Total documents
  - Subscription expiry date
- **Account Actions**:
  - View subscription details
  - Upgrade to premium
  - Logout

### 8. Dashboard & Analytics
- **Home Screen Statistics**:
  - Valid documents count
  - Expiring soon count (within 60 days)
  - Expired documents count
- **Upcoming Expiries**: List of documents expiring soon
- **Upcoming Reminders**: Next 3 scheduled reminders
- **Quick Actions**: Fast access to common tasks
- **Subscription Banner**: Upgrade prompts for non-premium users

---

## Technology Stack

### Frontend
- **Framework**: React Native 0.79.1
- **Runtime**: Expo SDK 53
- **Language**: TypeScript 5.8.3
- **Navigation**: Expo Router 5.0.3 (file-based routing)
- **UI Components**: Custom components with React Native core
- **Icons**: Lucide React Native 0.475.0
- **State Management**: 
  - React Context API
  - @nkzw/create-context-hook 1.1.0
  - Zustand 5.0.2
- **Data Fetching**: 
  - @tanstack/react-query 5.90.2
  - tRPC 11.6.0

### Backend
- **Server**: Hono 4.9.9 (lightweight web framework)
- **API**: tRPC 11.6.0 (type-safe API)
- **Serialization**: SuperJSON 2.2.2

### Storage
- **Local Storage**: @react-native-async-storage/async-storage 2.1.2
- **Image Storage**: Local file system (via expo-image-picker)

### Additional Libraries
- **Date/Time Picker**: @react-native-community/datetimepicker 8.4.1
- **Image Handling**: 
  - expo-image 2.1.6
  - expo-image-picker 16.1.4
- **Gestures**: react-native-gesture-handler 2.24.0
- **Safe Area**: react-native-safe-area-context 5.4.0
- **Validation**: Zod 4.1.11
- **Linking**: expo-linking 7.1.4

### Development Tools
- **Linting**: ESLint 9.31.0
- **Type Checking**: TypeScript strict mode
- **Package Manager**: Bun

---

## Project Structure

```
cardoc-reminder/
├── app/                          # Application screens (Expo Router)
│   ├── (auth)/                   # Authentication flow
│   │   ├── _layout.tsx          # Auth layout
│   │   ├── login.tsx            # Login screen
│   │   └── signup.tsx           # Signup screen
│   ├── (tabs)/                   # Main tab navigation
│   │   ├── _layout.tsx          # Tab layout configuration
│   │   ├── home.tsx             # Dashboard/Home screen
│   │   ├── vehicles.tsx         # Vehicles list screen
│   │   ├── reminders.tsx        # Reminders screen
│   │   ├── ai-assistant.tsx     # AI chat screen
│   │   └── profile.tsx          # User profile screen
│   ├── vehicle/
│   │   └── [id].tsx             # Vehicle details (dynamic route)
│   ├── document-history/
│   │   └── [id].tsx             # Document history viewer
│   ├── _layout.tsx              # Root layout
│   ├── index.tsx                # Entry point/redirect
│   ├── welcome.tsx              # Welcome screen
│   ├── onboarding.tsx           # Onboarding flow
│   ├── add-vehicle.tsx          # Add vehicle modal
│   ├── edit-vehicle.tsx         # Edit vehicle modal
│   ├── add-document.tsx         # Add/edit document modal
│   ├── add-reminder.tsx         # Add reminder modal
│   ├── edit-reminder.tsx        # Edit reminder modal
│   └── renewal.tsx              # Renewal service modal
├── backend/                      # Backend API
│   ├── trpc/
│   │   ├── routes/
│   │   │   └── example/
│   │   │       └── hi/
│   │   │           └── route.ts # Example tRPC route
│   │   ├── app-router.ts        # Main tRPC router
│   │   └── create-context.ts    # tRPC context creator
│   └── hono.ts                  # Hono server setup
├── components/                   # Reusable components
│   ├── StatusBadge.tsx          # Document status indicator
│   ├── VehicleCard.tsx          # Vehicle display card
│   ├── PremiumModal.tsx         # Subscription upgrade modal
│   ├── SubscriptionGate.tsx     # Feature access control
│   ├── SubscriptionBanner.tsx   # Upgrade prompt banner
│   └── RenewalModal.tsx         # Document renewal modal
├── hooks/                        # Custom React hooks
│   ├── useAppState.tsx          # Main app state management
│   └── useSubscription.tsx      # Subscription state management
├── lib/                          # Library configurations
│   └── trpc.ts                  # tRPC client setup
├── constants/                    # App constants
│   └── theme.ts                 # Theme configuration
├── types/                        # TypeScript type definitions
│   └── index.ts                 # Main type exports
├── utils/                        # Utility functions
│   └── date.ts                  # Date formatting utilities
├── assets/                       # Static assets
│   └── images/                  # App images
├── app.json                      # Expo configuration
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript configuration
└── eslint.config.js             # ESLint configuration
```

---

## Data Models

### User
```typescript
interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  subscriptionStatus: 'active' | 'expired' | 'trial';
  subscriptionExpiry: string; // ISO date string
  profilePhoto?: string; // URI
}
```

### Vehicle
```typescript
interface Vehicle {
  id: string;
  type: 'car' | 'truck' | 'bike' | 'bus' | 'other';
  name: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: string;
  imageUri?: string;
  createdAt: string; // ISO date string
}
```

### Document
```typescript
interface Document {
  id: string;
  vehicleId: string;
  type: 'insurance' | 'license' | 'roadworthiness' | 'emission' | 'registration' | 'other';
  customName?: string; // For 'other' type
  expiryDate: string; // ISO date string
  imageUri?: string;
  status: 'valid' | 'expiring' | 'expired';
  createdAt: string;
  updatedAt: string;
  history?: DocumentHistory[];
}

interface DocumentHistory {
  id: string;
  expiryDate: string;
  imageUri?: string;
  updatedAt: string;
}
```

### Reminder
```typescript
type ReminderType = 'maintenance' | 'insurance' | 'registration' | 
                    'service' | 'oil_change' | 'tire_rotation' | 'other';

interface Reminder {
  id: string;
  vehicleId: string;
  title: string;
  type: ReminderType;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  description?: string;
  isCustom: boolean;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  history?: ReminderHistory[];
}

interface ReminderHistory {
  id: string;
  title: string;
  type: ReminderType;
  date: string;
  time: string;
  description?: string;
  completedAt: string;
}
```

### Subscription Plans
```typescript
type SubscriptionPlan = '3-months' | '6-months' | '12-months';

interface PlanDetails {
  id: SubscriptionPlan;
  name: string;
  duration: number; // months
  monthlyPrice: number; // in Naira
  totalPrice: number;
  savings?: string;
}
```

---

## State Management

### App State (useAppState)
**Location**: `hooks/useAppState.tsx`

**Purpose**: Central state management for all app data

**State Variables**:
- `user`: Current user object
- `vehicles`: Array of all vehicles
- `documents`: Array of all documents
- `reminders`: Array of all reminders
- `isLoading`: Loading state indicator

**Actions**:

#### User Actions
- `setUser(user: User | null)`: Set/update user with persistence

#### Vehicle Actions
- `addVehicle(vehicle)`: Add new vehicle
- `updateVehicle(id, updates)`: Update vehicle details
- `deleteVehicle(id)`: Delete vehicle and related data

#### Document Actions
- `addDocument(document)`: Add new document
- `updateDocument(id, updates)`: Update document
- `deleteDocument(id)`: Delete document
- `renewDocument(id, newExpiryDate, imageUri?)`: Renew document with history

#### Reminder Actions
- `addReminder(reminder)`: Add new reminder
- `updateReminder(id, updates)`: Update reminder
- `deleteReminder(id)`: Delete reminder
- `completeReminder(id)`: Mark reminder as complete with history

#### Utility Actions
- `clearAllData()`: Clear all app data
- `clearCorruptedData()`: Clean up corrupted storage

**Data Persistence**:
- All data stored in AsyncStorage
- Automatic save on every mutation
- Corruption detection and recovery
- JSON validation before save/load

### Subscription State (useSubscription)
**Location**: `hooks/useSubscription.tsx`

**State Variables**:
- `isPremium`: Boolean indicating premium status
- `isTrialActive`: Boolean indicating active trial
- `daysLeftInTrial`: Number of days remaining in trial
- `subscriptionExpiry`: Expiry date string
- `currentPlan`: Current subscription plan

**Actions**:
- `activatePremium(plan)`: Activate premium subscription
- `checkSubscriptionStatus(user)`: Update subscription status
- `showUpgradePrompt()`: Check if upgrade prompt should show
- `getAvailablePlans()`: Get list of available plans

---

## Authentication & User Management

### Login Flow
1. User enters email and password
2. Mock authentication (production would call API)
3. User object created with trial subscription
4. Redirect to welcome screen
5. User data persisted to AsyncStorage

### Signup Flow
1. User enters name, email, phone, password
2. Mock registration (production would call API)
3. User object created with 14-day trial
4. Redirect to onboarding
5. User data persisted

### Session Management
- User data stored in AsyncStorage
- Automatic login on app restart if user exists
- Logout clears user data and redirects to login

### Profile Management
- Update profile photo (camera or gallery)
- View subscription status
- View account statistics
- Logout functionality

---

## Core Functionality

### Document Status Calculation
**Location**: `utils/date.ts`

```typescript
function getDocumentStatus(expiryDate: string): DocumentStatus {
  const daysUntil = getDaysUntilExpiry(expiryDate);
  
  if (daysUntil < 0) return 'expired';
  if (daysUntil <= 60) return 'expiring';
  return 'valid';
}

function getDaysUntilExpiry(expiryDate: string): number {
  const expiry = new Date(expiryDate);
  const now = new Date();
  const diffTime = expiry.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
```

### Document Renewal Process
1. User selects document to renew
2. Renewal modal opens with current document details
3. User selects new expiry date
4. Optionally uploads new document image
5. Current document moved to history
6. Document updated with new details
7. Status recalculated automatically

### Reminder Completion
1. User marks reminder as complete
2. Current reminder details saved to history
3. Reminder marked as completed with timestamp
4. Reminder moved to history view
5. History shows all completed instances

### Search Functionality
- **Vehicles**: Search by name, make, model, registration number
- **Documents**: Search by type or custom name
- **Reminders**: Search by title, type, description, or vehicle name
- Real-time filtering as user types
- Case-insensitive matching

---

## Backend Integration

### tRPC Setup
**Location**: `backend/hono.ts`, `lib/trpc.ts`

**Server Configuration**:
```typescript
// backend/hono.ts
const app = new Hono();
app.use("*", cors());
app.use("/trpc/*", trpcServer({
  endpoint: "/api/trpc",
  router: appRouter,
  createContext,
}));
```

**Client Configuration**:
```typescript
// lib/trpc.ts
export const trpc = createTRPCReact<AppRouter>();
export const trpcClient = trpc.createClient({
  links: [
    httpLink({
      url: `${getBaseUrl()}/api/trpc`,
      transformer: superjson,
    }),
  ],
});
```

### API Routes
**Location**: `backend/trpc/app-router.ts`

**Example Route**:
```typescript
// backend/trpc/routes/example/hi/route.ts
export const hiProcedure = protectedProcedure.query(() => {
  return { message: "Hello from tRPC!" };
});
```

### Usage in Components
```typescript
// React component
const hiQuery = trpc.example.hi.useQuery();

// Non-React context
const data = await trpcClient.example.hi.query();
```

---

## Subscription System

### Trial Period
- **Duration**: 14 days from signup
- **Features**: Full access to all premium features
- **Expiry**: Automatic downgrade to free tier after trial

### Premium Features
1. **Unlimited Vehicles**: Add as many vehicles as needed
2. **Unlimited Documents**: No limit on document storage
3. **AI Assistant**: Access to vehicle diagnostic AI
4. **Priority Support**: Faster renewal service processing
5. **Document History**: Full version control for documents
6. **Advanced Analytics**: Detailed insights and reports

### Subscription Gates
**Component**: `components/SubscriptionGate.tsx`

**Usage**:
```typescript
<SubscriptionGate
  feature="ai-assistant"
  fallback={<UpgradePrompt />}
>
  <AIAssistantScreen />
</SubscriptionGate>
```

### Upgrade Flow
1. User clicks upgrade button
2. Premium modal displays available plans
3. User selects plan
4. Payment processing (mock in current version)
5. Subscription activated
6. User data updated with new expiry date
7. Features unlocked immediately

---

## UI/UX Design

### Theme System
**Location**: `constants/theme.ts`

```typescript
export const theme = {
  colors: {
    primary: '#07c3aa',      // Teal
    secondary: '#6366f1',    // Indigo
    accent: '#f59e0b',       // Amber
    success: '#10b981',      // Green
    warning: '#f59e0b',      // Orange
    danger: '#ef4444',       // Red
    background: '#f5f5f5',   // Light gray
    card: '#ffffff',         // White
    text: '#1f2937',         // Dark gray
    textSecondary: '#6b7280',// Medium gray
    border: '#e5e7eb',       // Light border
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
};
```

### Design Patterns

#### Status Badges
- **Valid**: Green background, checkmark icon
- **Expiring**: Orange background, clock icon
- **Expired**: Red background, alert icon

#### Cards
- Rounded corners (12px)
- Subtle shadow
- White background
- Consistent padding (16px)

#### Buttons
- Primary: Teal background, white text
- Secondary: White background, teal border
- Danger: Red background, white text

#### Navigation
- Bottom tabs with icons
- Stack navigation for details
- Modal presentation for forms

---

## Installation & Setup

### Prerequisites
- Node.js 18+ or Bun
- Expo CLI
- iOS Simulator (Mac) or Android Emulator
- Expo Go app (for physical device testing)

### Installation Steps

1. **Clone Repository**
```bash
git clone <repository-url>
cd cardoc-reminder
```

2. **Install Dependencies**
```bash
bun install
# or
npm install
```

3. **Environment Setup**
Create `.env` file:
```env
EXPO_PUBLIC_RORK_API_BASE_URL=<your-api-url>
```

4. **Start Development Server**
```bash
bun run start
# or
npm start
```

5. **Run on Platform**
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go for physical device

### Build Configuration

**iOS**:
```json
{
  "ios": {
    "supportsTablet": true,
    "bundleIdentifier": "app.rork.cardoc-reminder",
    "infoPlist": {
      "NSPhotoLibraryUsageDescription": "Allow access to photos",
      "NSCameraUsageDescription": "Allow access to camera",
      "NSMicrophoneUsageDescription": "Allow access to microphone"
    }
  }
}
```

**Android**:
```json
{
  "android": {
    "package": "app.rork.cardoc-reminder",
    "permissions": [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ]
  }
}
```

---

## API Reference

### AsyncStorage Keys
- `user`: User object
- `vehicles`: Array of vehicles
- `documents`: Array of documents
- `reminders`: Array of reminders
- `theme_mode`: Theme preference

### Date Utilities
```typescript
// Format date for display
formatDate(dateString: string): string

// Get days until expiry
getDaysUntilExpiry(expiryDate: string): number

// Get document status
getDocumentStatus(expiryDate: string): DocumentStatus

// Get status text
getStatusText(daysUntil: number): string
```

### Navigation
```typescript
// Navigate to screen
router.push('/screen-name')

// Navigate with params
router.push(`/vehicle/${vehicleId}`)

// Go back
router.back()

// Replace current screen
router.replace('/screen-name')
```

---

## Deployment

### Expo Build
```bash
# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android

# Build for both
eas build --platform all
```

### Web Deployment
```bash
# Build web version
expo export:web

# Deploy to hosting service
# (Vercel, Netlify, etc.)
```

### Backend Deployment
The Hono backend can be deployed to:
- Vercel
- Cloudflare Workers
- AWS Lambda
- Any Node.js hosting

### Environment Variables
Production environment variables needed:
- `EXPO_PUBLIC_RORK_API_BASE_URL`: Backend API URL
- Database connection strings (when implemented)
- Payment gateway keys (when implemented)
- Push notification keys (when implemented)

---

## Database Recommendations

### Recommended Database: Supabase

**Why Supabase?**
1. **PostgreSQL**: Robust relational database
2. **Real-time**: Built-in real-time subscriptions
3. **Authentication**: Built-in auth system
4. **Storage**: File storage for images
5. **Row Level Security**: Fine-grained access control
6. **Free Tier**: Generous free tier for development

### Database Schema

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  subscription_status TEXT DEFAULT 'trial',
  subscription_expiry TIMESTAMP,
  profile_photo TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vehicles table
CREATE TABLE vehicles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  registration_number TEXT NOT NULL,
  make TEXT NOT NULL,
  model TEXT NOT NULL,
  year TEXT NOT NULL,
  image_uri TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Documents table
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  custom_name TEXT,
  expiry_date DATE NOT NULL,
  image_uri TEXT,
  status TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Document history table
CREATE TABLE document_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  expiry_date DATE NOT NULL,
  image_uri TEXT,
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Reminders table
CREATE TABLE reminders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  vehicle_id UUID REFERENCES vehicles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  description TEXT,
  is_custom BOOLEAN DEFAULT false,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Reminder history table
CREATE TABLE reminder_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reminder_id UUID REFERENCES reminders(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  type TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  description TEXT,
  completed_at TIMESTAMP DEFAULT NOW()
);
```

### Alternative: Firebase
- **Firestore**: NoSQL document database
- **Authentication**: Built-in auth
- **Storage**: Cloud storage for images
- **Cloud Functions**: Serverless backend
- **Push Notifications**: FCM integration

---

## Admin Panel Structure

### Recommended Approach: Separate Web App

**Why Separate?**
1. Different user interface requirements
2. Different permissions and security
3. Easier to maintain and deploy
4. Can use different tech stack if needed

### Admin Panel Features

#### Dashboard
- Total users count
- Active subscriptions
- Revenue metrics
- Document renewal requests
- System health status

#### User Management
- View all users
- Search and filter users
- View user details
- Manage subscriptions
- View user activity logs
- Send notifications

#### Renewal Requests
- View pending renewal requests
- Assign to agents
- Update request status
- Track completion
- Generate invoices

#### Analytics
- User growth charts
- Subscription conversion rates
- Document expiry trends
- Revenue reports
- Popular vehicle types

#### Settings
- Pricing configuration
- Document types management
- Notification templates
- System configuration

### Admin Panel Tech Stack
- **Framework**: Next.js 14+ (React)
- **UI**: Shadcn/ui or Material-UI
- **Charts**: Recharts or Chart.js
- **Tables**: TanStack Table
- **Authentication**: Same as mobile app
- **API**: Shared tRPC backend

### Admin User Type
```typescript
interface AdminUser extends User {
  role: 'admin' | 'agent' | 'super_admin';
  permissions: string[];
  department?: string;
}
```

### Access Control
- Role-based access control (RBAC)
- Separate admin authentication
- Different database permissions
- Audit logging for admin actions

---

## Future Enhancements

### Planned Features
1. **Push Notifications**: Expiry reminders and alerts
2. **Real AI Integration**: Replace mock AI with actual service
3. **Payment Integration**: Stripe/Paystack for subscriptions
4. **Document OCR**: Auto-extract document details from images
5. **Multi-language Support**: Localization
6. **Dark Mode**: Theme switching
7. **Offline Mode**: Full offline functionality
8. **Export Data**: PDF reports and data export
9. **Sharing**: Share vehicle details with family/mechanics
10. **Calendar Integration**: Sync reminders with device calendar

### Technical Improvements
1. **Real Backend**: Replace mock auth with real API
2. **Database Migration**: Move from AsyncStorage to cloud database
3. **Image Optimization**: Compress and optimize images
4. **Caching Strategy**: Implement proper caching
5. **Error Tracking**: Sentry or similar
6. **Analytics**: User behavior tracking
7. **A/B Testing**: Feature testing framework
8. **Performance Monitoring**: Track app performance

---

## Troubleshooting

### Common Issues

#### JSON Parse Error
**Error**: "JSON Parse error: Unexpected character: o"
**Solution**: Clear corrupted AsyncStorage data
```typescript
await AsyncStorage.clear();
```

#### Image Picker Not Working
**Issue**: Permissions not granted
**Solution**: Check app.json permissions and request at runtime

#### Navigation Issues
**Issue**: Screen not found
**Solution**: Check file naming in app/ directory matches route

#### Backend Connection Failed
**Issue**: Cannot connect to tRPC backend
**Solution**: Verify EXPO_PUBLIC_RORK_API_BASE_URL is set correctly

---

## Contributing Guidelines

### Code Style
- Use TypeScript strict mode
- Follow ESLint rules
- Use functional components
- Implement proper error handling
- Add console logs for debugging
- Use testID for UI testing

### Git Workflow
1. Create feature branch
2. Make changes
3. Test thoroughly
4. Commit with descriptive message
5. Create pull request
6. Code review
7. Merge to main

### Testing
- Test on iOS and Android
- Test on different screen sizes
- Test offline functionality
- Test error scenarios
- Test subscription flows

---

## License & Credits

### App Information
- **Name**: Cardan
- **Version**: 1.0.0
- **Bundle ID**: app.rork.cardoc-reminder

### Technologies Used
- React Native & Expo
- TypeScript
- Hono & tRPC
- Lucide Icons
- React Query

---

## Contact & Support

For technical support or questions about the codebase, refer to:
- Code comments in source files
- TypeScript type definitions
- This documentation

---

## Appendix

### Useful Commands
```bash
# Start development server
bun run start

# Clear cache
expo start -c

# Check TypeScript
tsc --noEmit

# Run linter
bun run lint

# Install new package
bun add <package-name>

# Update dependencies
bun update
```

### File Naming Conventions
- Screens: PascalCase (e.g., `HomeScreen.tsx`)
- Components: PascalCase (e.g., `VehicleCard.tsx`)
- Hooks: camelCase with 'use' prefix (e.g., `useAppState.tsx`)
- Utils: camelCase (e.g., `date.ts`)
- Types: PascalCase (e.g., `Vehicle`, `Document`)

### Best Practices
1. Always use TypeScript types
2. Implement error boundaries
3. Handle loading states
4. Provide user feedback
5. Validate user input
6. Optimize images
7. Use memoization for expensive operations
8. Clean up subscriptions and listeners
9. Test on real devices
10. Monitor performance

---

**End of Documentation**

This documentation provides a complete overview of the Cardan app architecture, features, and implementation details. Use it as a reference for development, maintenance, and replication of the application.
