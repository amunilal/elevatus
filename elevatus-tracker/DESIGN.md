# ElevateUs Design System

A comprehensive design system for the ElevateUs employee review application.

## Table of Contents
- [Overview](#overview)
- [Color Palette](#color-palette)
- [Logo & Branding](#logo--branding)
- [Typography](#typography)
- [Components](#components)
- [Usage Guidelines](#usage-guidelines)
- [Implementation](#implementation)

## Overview

The ElevateUs design system is built to foster continuous growth, streamline performance management, and align individual development with company objectives. Our design emphasizes clarity, accessibility, and modern aesthetics while maintaining professional appeal.

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
The ElevateUs logo should be exported as an SVG component from Figma:

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
  // SVG exported from Figma Logo component
  return (
    <svg 
      className={`logo-${size} ${className}`}
      viewBox="0 0 200 60"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* SVG content from Figma export */}
    </svg>
  );
};
```

**Implementation Requirements:**
- [ ] Export Logo component from Figma as SVG
- [ ] Replace all logo images with Logo component
- [ ] Implement size variants (sm: 24px, md: 32px, lg: 48px)
- [ ] Apply brand gradient to logo background

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

## Checklist for Implementation

- [ ] Export Logo component from Figma as SVG
- [ ] Update Tailwind configuration with design system colors
- [ ] Replace all logo images with Logo component
- [ ] Implement hover states across all interactive elements
- [ ] Apply brand gradient to headers and key CTAs
- [ ] Update card components with light color backgrounds
- [ ] Ensure accessibility contrast ratios are met
- [ ] Test responsive behavior across all breakpoints
- [ ] Document component variations and usage

---

*This design system is living document and should be updated as the ElevateUs application evolves.*