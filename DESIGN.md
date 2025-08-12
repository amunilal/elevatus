
# ElevatUs Design System

A comprehensive design system for the ElevatUs employee review application.

## Table of Contents
- [Overview](#overview)
- [Color Palette](#color-palette)
- [Logo & Branding](#logo--branding)
- [Typography](#typography)
- [Components](#components)
- [Usage Guidelines](#usage-guidelines)
- [Implementation](#implementation)

## Overview

The ElevatUs design system is built to foster continuous growth, streamline performance management, and align individual development with company objectives. Our design emphasizes clarity, accessibility, and modern aesthetics while maintaining professional appeal.

**Figma Reference**: [Employee Tracker Design](https://www.figma.com/design/bPEmra9A4sZB3eKhRqSa8u/Employee-Tracker?node-id=43-351&t=Rw8J1Qx0ITT4Zc1o-1)

## Color Palette

### Primary Light Colors
Our primary palette consists of soft, approachable colors that create a welcoming user experience:

```css
/* Light Yellow - Warmth & Optimism */
--color-light-yellow: #FEE7A2;

/* Light Green - Growth & Success */
--color-light-green: #D4ED84;

/* Light Mint - Freshness & Innovation */
--color-light-mint: #C1F3DF;

/* Light Purple - Creativity & Vision */
--color-light-purple: #DFD6F6;

/* Light Pink - Collaboration & Care */
--color-light-pink: #F2CEF0;
```

**Usage Guidelines:**
- Use for card backgrounds, gentle highlights, and section dividers
- Perfect for dashboard widgets and status indicators
- Ideal for creating visual hierarchy without overwhelming users

### Hover States
Enhanced interactive colors that provide clear feedback:

```css
/* Interactive Colors */
--color-hover-magenta: #F59CE9;
--color-hover-lavender: #BA9DF5;
--color-hover-lime: #D4F580;
--color-hover-gold: #F5D376;
--color-hover-orange: #F5A171;
--color-hover-aqua: #8FF5D1;
--color-hover-coral: #F58784;
--color-hover-teal: #79CACC;
--color-hover-periwinkle: #95B3F5;
```

**Usage Guidelines:**
- Apply to buttons, links, and interactive elements on hover
- Maintain accessibility contrast ratios (minimum 4.5:1)
- Use consistently across all interactive components

### Brand Gradient
Our signature gradient represents innovation and forward-thinking:

```css
/* Brand Gradient */
.brand-gradient {
  background: linear-gradient(135deg, #F2A5A3 0%, #EE7DBD 50%, #816CC4 100%);
}

/* CSS Custom Properties */
--gradient-left: #F2A5A3;
--gradient-middle: #EE7DBD;
--gradient-right: #816CC4;
```

**Usage Guidelines:**
- Primary use: Logo backgrounds and portal headers
- Secondary use: Call-to-action buttons and important highlights
- Avoid overuse - reserve for key brand moments

### Base Colors
Foundation colors for layouts and content:

```css
/* Base Colors */
--color-background: #ECECEC;  /* Main background */
--color-navigation: #FFFFFF;  /* Navigation & cards */
--color-text-primary: #1F2937;
--color-text-secondary: #6B7280;
--color-border: #E5E7EB;
```

## Logo & Branding

### Logo Component
The ElevatUs logo is implemented as an SVG component with gradient styling:

```jsx
// components/ui/Logo.tsx
import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'full' | 'icon';
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'full',
  className = '' 
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  const LogoSVG = () => (
    <svg 
      className={sizeClasses[size]} 
      viewBox="0 0 488 488" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      <path 
        d="M408.958 219.563L289.681 305.482M205.84 176.563L86.5632 262.482M419.5 266C279.125 393.908 218.826 405.627 117 299M371.501 194C237.5 65.4999 195 128 17.5 264.5M479 244C479 373.787 373.787 479 244 479C114.213 479 9 373.787 9 244C9 114.213 114.213 9 244 9C373.787 9 479 114.213 479 244ZM323 242C323 284.526 288.526 319 246 319C203.474 319 169 284.526 169 242C169 199.474 203.474 165 246 165C288.526 165 323 199.474 323 242Z" 
        stroke="url(#paint0_linear_62_289)" 
        strokeWidth="18" 
        strokeLinecap="round"
      />
      <defs>
        <linearGradient 
          id="paint0_linear_62_289" 
          x1="61.5" 
          y1="95.5" 
          x2="421" 
          y2="403" 
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F2A5A3"/>
          <stop offset="0.581731" stopColor="#EE7DBD"/>
          <stop offset="1" stopColor="#816CC4"/>
        </linearGradient>
      </defs>
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={className}>
        <LogoSVG />
      </div>
    );
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className="mr-3">
        <LogoSVG />
      </div>
      <span className={`font-bold text-gray-900 ${size === 'sm' ? 'text-lg' : size === 'md' ? 'text-xl' : 'text-2xl'}`}>
        ElevatUs
      </span>
    </div>
  );
};
```

**Implementation Status:**
- [x] ~~Export Logo component from Figma as SVG~~ ✅ Completed
- [x] ~~Replace all logo images with Logo component~~ ✅ Completed
- [x] ~~Implement size variants (sm: 24px, md: 32px, lg: 48px)~~ ✅ Completed
- [x] ~~Apply brand gradient to logo background~~ ✅ Completed

### Logo Usage
- **Primary**: Full logo with gradient background
- **Secondary**: Icon-only version for compact spaces
- **Minimum size**: 24px height for readability
- **Clear space**: Maintain 1x logo height of clear space around logo

## Typography

### Font Stack
```css
font-family: 'Inter', system-ui, -apple-system, sans-serif;
```

### Type Scale
```css
/* Headings */
--text-4xl: 2.25rem;  /* 36px - Page titles */
--text-3xl: 1.875rem; /* 30px - Section headers */
--text-2xl: 1.5rem;   /* 24px - Card titles */
--text-xl: 1.25rem;   /* 20px - Subsections */
--text-lg: 1.125rem;  /* 18px - Large body */

/* Body Text */
--text-base: 1rem;    /* 16px - Default body */
--text-sm: 0.875rem;  /* 14px - Secondary text */
--text-xs: 0.75rem;   /* 12px - Captions, labels */
```

## Components

### Cards
Primary container component for content sections:

```css
.card {
  background: var(--color-navigation);
  border-radius: 0.75rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-border);
}

.card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.15s ease-in-out;
}
```

### Buttons
Interactive elements with consistent styling:

```css
/* Primary Button */
.btn-primary {
  background: var(--gradient-middle);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 500;
  transition: all 0.15s ease-in-out;
}

.btn-primary:hover {
  background: var(--color-hover-magenta);
  transform: translateY(-1px);
}

/* Secondary Button */
.btn-secondary {
  background: var(--color-light-purple);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-hover-lavender);
}
```

### Status Indicators
Visual elements for showing states and progress:

```css
/* Status Colors */
.status-success {
  background: var(--color-light-green);
  color: var(--color-text-primary);
}

.status-warning {
  background: var(--color-light-yellow);
  color: var(--color-text-primary);
}

.status-info {
  background: var(--color-light-mint);
  color: var(--color-text-primary);
}

.status-pending {
  background: var(--color-light-purple);
  color: var(--color-text-primary);
}
```

## Usage Guidelines

### Color Application

#### Dashboard Cards
- Use light colors for card backgrounds
- Apply hover states for interactive elements
- Reserve gradient for key call-to-action elements

#### Forms
- Light backgrounds for input field groups
- Hover colors for interactive form elements
- Error states use coral (#F58784) for clear feedback

#### Navigation
- White background for primary navigation
- Gradient accents for active states
- Light purple for secondary navigation elements

### Accessibility

#### Contrast Requirements
- Text on light backgrounds: minimum 4.5:1 ratio
- Interactive elements: minimum 3:1 ratio
- Focus indicators: 2px solid outline with hover color

#### Interactive States
- Hover: Color change + subtle transform
- Focus: Visible outline + color change
- Active: Pressed state with darker color
- Disabled: 50% opacity with cursor: not-allowed

### Component Spacing
```css
/* Spacing Scale */
--space-xs: 0.25rem;  /* 4px */
--space-sm: 0.5rem;   /* 8px */
--space-md: 1rem;     /* 16px */
--space-lg: 1.5rem;   /* 24px */
--space-xl: 2rem;     /* 32px */
--space-2xl: 3rem;    /* 48px */
```

## Implementation

### Tailwind Configuration
Update your Tailwind config to include the design system colors:

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        // Light Colors
        'light-yellow': '#FEE7A2',
        'light-green': '#D4ED84',
        'light-mint': '#C1F3DF',
        'light-purple': '#DFD6F6',
        'light-pink': '#F2CEF0',
        
        // Hover States
        'hover-magenta': '#F59CE9',
        'hover-lavender': '#BA9DF5',
        'hover-lime': '#D4F580',
        'hover-gold': '#F5D376',
        'hover-orange': '#F5A171',
        'hover-aqua': '#8FF5D1',
        'hover-coral': '#F58784',
        'hover-teal': '#79CACC',
        'hover-periwinkle': '#95B3F5',
        
        // Brand
        'brand-left': '#F2A5A3',
        'brand-middle': '#EE7DBD',
        'brand-right': '#816CC4',
        
        // Base
        'bg-base': '#ECECEC',
        'nav-white': '#FFFFFF',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #F2A5A3 0%, #EE7DBD 50%, #816CC4 100%)',
      }
    }
  }
}
```

### CSS Custom Properties
For broader CSS support, define custom properties:

```css
:root {
  /* Light Colors */
  --light-yellow: #FEE7A2;
  --light-green: #D4ED84;
  --light-mint: #C1F3DF;
  --light-purple: #DFD6F6;
  --light-pink: #F2CEF0;
  
  /* Hover States */
  --hover-magenta: #F59CE9;
  --hover-lavender: #BA9DF5;
  --hover-lime: #D4F580;
  --hover-gold: #F5D376;
  --hover-orange: #F5A171;
  --hover-aqua: #8FF5D1;
  --hover-coral: #F58784;
  --hover-teal: #79CACC;
  --hover-periwinkle: #95B3F5;
  
  /* Brand Gradient */
  --brand-gradient: linear-gradient(135deg, #F2A5A3 0%, #EE7DBD 50%, #816CC4 100%);
  
  /* Base Colors */
  --bg-base: #ECECEC;
  --nav-white: #FFFFFF;
}
```

### Component Examples

#### Dashboard Card
```jsx
<div className="bg-light-mint hover:bg-hover-aqua transition-colors duration-200 rounded-xl p-6 border border-gray-200">
  <h3 className="text-lg font-semibold text-gray-900">Employee Stats</h3>
  <p className="text-3xl font-bold text-gray-900 mt-2">24</p>
</div>
```

#### Primary Button
```jsx
<button className="bg-gradient-to-r from-brand-left via-brand-middle to-brand-right text-white px-6 py-3 rounded-lg font-medium hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
  Add Employee
</button>
```

#### Status Badge
```jsx
<span className="bg-light-green text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
  Active
</span>
```

---

## Implementation Status

### Completed Features ✅

#### Logo & Branding
- [x] ~~Export Logo component from Figma as SVG~~ ✅ Completed
- [x] ~~Replace all logo images with Logo component~~ ✅ Completed
- [x] ~~Implement size variants (sm: h-6 w-6, md: h-8 w-8, lg: h-12 w-12)~~ ✅ Completed
- [x] ~~Apply brand gradient to logo SVG~~ ✅ Completed

#### Design System Implementation
- [x] ~~Update Tailwind configuration with design system colors~~ ✅ Completed
- [x] ~~Implement hover states across all interactive elements~~ ✅ Completed
- [x] ~~Apply brand gradient to headers and key CTAs~~ ✅ Completed
- [x] ~~Update card components with light color backgrounds~~ ✅ Completed

#### Page Updates
- [x] ~~Dashboard redesign with minimal clean style~~ ✅ Completed
- [x] ~~Login page styling with Logo component~~ ✅ Completed
- [x] ~~Home page complete redesign~~ ✅ Completed
- [x] ~~Employee forms with new UI components~~ ✅ Completed

#### Component Library
- [x] ~~Button component with gradient variant~~ ✅ Completed
- [x] ~~Card components with hover effects~~ ✅ Completed
- [x] ~~Input components with error states~~ ✅ Completed
- [x] ~~Select components with design system styling~~ ✅ Completed
- [x] ~~Badge components with color variants~~ ✅ Completed

### Quality Assurance
- [x] ~~Ensure accessibility contrast ratios are met~~ ✅ Completed
- [x] ~~Test responsive behavior across all breakpoints~~ ✅ Completed
- [x] ~~Document component variations and usage~~ ✅ Completed

### Recent Updates (Home & Login Pages)

#### Home Page Features
- **Logo Integration**: Large Logo component in hero section and icon variant in footer
- **Gradient Typography**: Brand gradient applied to main heading text
- **Feature Cards**: Three feature cards with light color backgrounds (mint, purple, green)
- **CTA Buttons**: Gradient and outline Button variants with icons
- **Professional Layout**: Hero section, features section, and branded footer

#### Login Page Features  
- **Centered Logo**: Logo component prominently displayed above login form
- **Design System Form**: Input and Button components with consistent styling
- **Error Handling**: Light pink background with coral border for error messages
- **Information Boxes**: Light yellow highlight box for important information
- **Brand Consistency**: Maintains visual consistency with rest of application

#### Implementation Examples

**Home Page Hero Section:**
```jsx
<div className="flex justify-center mb-12">
  <Logo size="lg" />
</div>
<h1 className="text-4xl font-bold tracking-tight text-secondary-900 sm:text-5xl md:text-6xl">
  <span className="block mb-4">Welcome to</span>
  <span className="block bg-gradient-to-r from-brand-start via-brand-middle to-brand-end bg-clip-text text-transparent">
    ElevatUs Employee Tracker
  </span>
</h1>
```

**Feature Cards with Light Backgrounds:**
```jsx
<Card className="bg-light-mint hover:shadow-medium transition-shadow">
  <CardContent className="p-8 text-center">
    <div className="inline-flex items-center justify-center w-16 h-16 bg-hover-teal rounded-2xl mb-6">
      {/* Icon SVG */}
    </div>
    <h3 className="text-xl font-semibold text-secondary-900 mb-4">Feature Title</h3>
    <p className="text-secondary-600">Feature description...</p>
  </CardContent>
</Card>
```

**Login Form with Components:**
```jsx
<Card className="bg-nav-white shadow-medium">
  <CardContent className="p-8">
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        type="email"
        placeholder="admin@company.co.za"
        error={!!error}
      />
      <Button variant="gradient" type="submit" className="w-full">
        Sign in
      </Button>
    </form>
  </CardContent>
</Card>
```

---

## UI/UX Specifications & Updates

### Dashboard View - Employer Portal

#### Required Changes
- **Remove Components**: Eliminate "Present Today" card completely from stats grid
- **Update Card Titles**: 
  - "Leave Requests" → "Completed reviews"
  - Add back "Pending reviews" component to dashboard stats
- **Quick Actions Updates**:
  - "View attendance" → "Review history" with subtitle "List of past employee reviews"
  - "Manage Leave" → "Start Review"  
  - "Generate Report" subtitle → "Begin employee performance review"

#### Implementation Guidelines
```jsx
// Dashboard Stats Grid - Updated Cards
<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
  {/* Total Employees - Keep existing */}
  <Link href="/employer/employees" className="block">
    <div className="bg-nav-white rounded-2xl p-6 hover:shadow-medium transition-shadow cursor-pointer">
      {/* Existing total employees card */}
    </div>
  </Link>

  {/* Pending Reviews - Add back */}
  <div className="bg-nav-white rounded-2xl p-6">
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-brand-middle rounded-lg flex items-center justify-center">
        <ClockIcon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-brand-middle mb-1">Pending reviews</p>
        <p className="text-2xl font-bold text-secondary-900">6</p>
      </div>
    </div>
  </div>

  {/* Completed Reviews - Updated title */}
  <div className="bg-nav-white rounded-2xl p-6">
    <div className="flex items-center space-x-4">
      <div className="w-10 h-10 bg-hover-lime rounded-lg flex items-center justify-center">
        <CheckIcon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-success-600 mb-1">Completed reviews</p>
        <p className="text-2xl font-bold text-secondary-900">18</p>
      </div>
    </div>
  </div>
</div>

// Quick Actions - Updated titles and subtitles
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
  <Link href="/employer/employees/new" className="block p-6 rounded-2xl bg-light-mint hover:bg-hover-aqua transition-colors">
    <h3 className="font-semibold text-secondary-900 mb-2">Add Employee</h3>
    <p className="text-sm text-secondary-600">Create new employee profile</p>
  </Link>
  
  <Link href="/employer/reviews/start" className="block p-6 rounded-2xl bg-light-purple hover:bg-hover-lavender transition-colors">
    <h3 className="font-semibold text-secondary-900 mb-2">Start Review</h3>
    <p className="text-sm text-secondary-600">Begin employee performance review</p>
  </Link>
  
  <Link href="/employer/reviews/history" className="block p-6 rounded-2xl bg-light-green hover:bg-hover-lime transition-colors">
    <h3 className="font-semibold text-secondary-900 mb-2">Review History</h3>
    <p className="text-sm text-secondary-600">List of past employee reviews</p>
  </Link>
</div>
```

### Employee Management - List View Updates

#### Required Changes
- **Remove Actions Column**: Eliminate entire Actions column and all action buttons
- **Row Interaction**: Make each table row clickable with hover highlight
- **Sidebar Implementation**: Right-side slide-in overlay following Figma "Employee List" Component
- **Column Updates**:
  - Employee column: Name + surname with profile image only
  - Remove "Hire Date" column completely  
  - Remove "Phone Number" column completely
- **Sidebar Profile**: Larger profile bar extending to position column width

#### Implementation Guidelines

**Table Row Styling:**
```jsx
// Employee table with clickable rows
<tr 
  onClick={() => openEmployeeSidebar(employee.id)}
  className="hover:bg-light-purple cursor-pointer transition-colors border-b border-secondary-200"
>
  <td className="px-6 py-4">
    <div className="flex items-center space-x-3">
      <img 
        src={employee.profileImage || '/default-avatar.png'} 
        alt={employee.name}
        className="w-10 h-10 rounded-full object-cover"
      />
      <div>
        <p className="font-medium text-secondary-900">
          {employee.firstName} {employee.lastName}
        </p>
      </div>
    </div>
  </td>
  <td className="px-6 py-4 text-sm text-secondary-600">{employee.department}</td>
  <td className="px-6 py-4 text-sm text-secondary-600">{employee.position}</td>
  <td className="px-6 py-4">
    <Badge variant={employee.status === 'ACTIVE' ? 'success' : 'secondary'}>
      {employee.status}
    </Badge>
  </td>
</tr>
```

**Sidebar Component:**
```jsx
// Right-side slide-in sidebar overlay
<div className={`fixed inset-y-0 right-0 w-96 bg-nav-white shadow-xl transform ${
  isOpen ? 'translate-x-0' : 'translate-x-full'
} transition-transform duration-300 ease-in-out z-50`}>
  
  {/* Large Profile Header */}
  <div className="bg-light-purple p-8 border-b border-secondary-200">
    <div className="flex items-center space-x-4">
      <img 
        src={selectedEmployee?.profileImage || '/default-avatar.png'} 
        alt={selectedEmployee?.name}
        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md"
      />
      <div>
        <h2 className="text-xl font-bold text-secondary-900">
          {selectedEmployee?.firstName} {selectedEmployee?.lastName}
        </h2>
        <p className="text-secondary-600">{selectedEmployee?.position}</p>
        <p className="text-sm text-secondary-500">{selectedEmployee?.department}</p>
      </div>
    </div>
  </div>

  {/* Employee Details */}
  <div className="p-6 space-y-6">
    {/* Contact Information */}
    <div>
      <h3 className="font-semibold text-secondary-900 mb-3">Contact Information</h3>
      <div className="space-y-2">
        <p className="text-sm"><span className="font-medium">Email:</span> {selectedEmployee?.email}</p>
        <p className="text-sm"><span className="font-medium">Phone:</span> {selectedEmployee?.phoneNumber}</p>
        <p className="text-sm"><span className="font-medium">ID Number:</span> {selectedEmployee?.idNumber}</p>
      </div>
    </div>

    {/* Employment Details */}
    <div>
      <h3 className="font-semibold text-secondary-900 mb-3">Employment Details</h3>
      <div className="space-y-2">
        <p className="text-sm"><span className="font-medium">Employee #:</span> {selectedEmployee?.employeeNumber}</p>
        <p className="text-sm"><span className="font-medium">Hire Date:</span> {selectedEmployee?.hireDate}</p>
        <p className="text-sm"><span className="font-medium">Salary:</span> R{selectedEmployee?.salary?.toLocaleString()}</p>
      </div>
    </div>
  </div>

  {/* Close Button */}
  <button 
    onClick={closeSidebar}
    className="absolute top-4 right-4 p-2 hover:bg-secondary-100 rounded-full transition-colors"
  >
    <XIcon className="w-5 h-5 text-secondary-600" />
  </button>
</div>

{/* Overlay backdrop */}
{isOpen && (
  <div 
    className="fixed inset-0 bg-black bg-opacity-50 z-40"
    onClick={closeSidebar}
  />
)}
```

### Employee Profile & Form Updates

#### Required Changes
- **Remove Quick Actions**: Eliminate Quick Actions section from full employee profile view
- **Form Component**: Create dedicated form component for editing employee profiles
- **Purple Theming**: Consistent purple color scheme throughout, eliminate other colors
- **Activity Updates**: Recent activity must update when adding new employees

#### Implementation Guidelines

**Employee Profile Form:**
```jsx
// Employee profile edit form with purple theming
<Card className="bg-light-purple">
  <CardHeader>
    <CardTitle>Employee Information</CardTitle>
    <CardDescription>Update employee details and information</CardDescription>
  </CardHeader>
  <CardContent>
    <form className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="First Name"
          value={formData.firstName}
          onChange={handleChange}
          variant="filled"
          className="bg-white"
        />
        <Input
          label="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          variant="filled"
          className="bg-white"
        />
      </div>
      
      <div className="flex justify-end space-x-4">
        <Button variant="outline">Cancel</Button>
        <Button variant="gradient" type="submit">Save Changes</Button>
      </div>
    </form>
  </CardContent>
</Card>
```

### Notification System Updates

#### Required Changes
- **Success Popup**: Ensure full readability and larger size
- **Positioning**: All popups properly positioned and sized
- **Recent Activity**: Must update dynamically when adding new employees

#### Implementation Guidelines

**Enhanced Toast Notifications:**
```jsx
// Updated toast component with larger size and better positioning
<div className={`fixed top-4 right-4 max-w-sm w-full bg-nav-white rounded-lg shadow-lg border-l-4 ${
  type === 'success' ? 'border-hover-lime' : 'border-hover-coral'
} p-4 z-50 transform transition-all duration-300 ${
  isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
}`}>
  <div className="flex items-start">
    <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${
      type === 'success' ? 'bg-hover-lime' : 'bg-hover-coral'
    }`}>
      {type === 'success' ? <CheckIcon className="w-4 h-4 text-white" /> : <XIcon className="w-4 h-4 text-white" />}
    </div>
    <div className="ml-3 flex-1">
      <p className="text-sm font-semibold text-secondary-900">{title}</p>
      {message && <p className="text-sm text-secondary-600 mt-1">{message}</p>}
    </div>
  </div>
</div>
```

**Activity Feed Updates:**
```jsx
// Dynamic activity feed that updates with new employees
const updateRecentActivity = (activity) => {
  setRecentActivities(prev => [
    {
      id: Date.now(),
      type: activity.type,
      message: activity.message,
      timestamp: new Date().toISOString(),
      user: activity.user
    },
    ...prev.slice(0, 9) // Keep last 10 activities
  ]);
};

// Usage when adding employee
const handleEmployeeCreated = (employee) => {
  updateRecentActivity({
    type: 'employee_created',
    message: `New employee ${employee.firstName} ${employee.lastName} added to ${employee.department}`,
    user: 'Admin'
  });
};
```

### Design System Notes

#### Figma Reference Components
- **"Employee List" Component**: Reference for sidebar specifications and layout
- **Purple Theming**: Consistent use of `light-purple` and `hover-lavender` throughout new employee pages
- **Interactive Elements**: All hover states must follow established design system patterns

#### Implementation Priorities
1. **Dashboard Updates**: Remove/update cards and Quick Actions as specified
2. **Employee List Redesign**: Implement clickable rows and slide-in sidebar
3. **Form Consistency**: Apply purple theming to all employee-related forms
4. **Notification Enhancement**: Larger, more readable toast notifications
5. **Activity Integration**: Real-time updates when employees are added/modified

#### Accessibility Requirements
- **Keyboard Navigation**: Ensure sidebar can be opened/closed with keyboard
- **Screen Reader Support**: Proper ARIA labels for interactive table rows
- **Focus Management**: Handle focus appropriately when sidebar opens/closes
- **Color Contrast**: Maintain minimum 4.5:1 ratio for all text elements

---

*This design system is living document and should be updated as the ElevatUs application evolves.*