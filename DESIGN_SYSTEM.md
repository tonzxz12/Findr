# QFindr Design System

## Overview
All pages in this application are now fully aligned with the `globals.css` design system, ensuring consistent styling and branding throughout the platform using the QFindr brand and Quanby logo.

## CSS Foundation (`globals.css`)

### Color System (OKLCH Color Space)
- **Primary**: `--primary` - Main brand color (green accent)
- **Secondary**: `--secondary` - Supporting colors
- **Background**: `--background` - Main background color
- **Foreground**: `--foreground` - Main text color
- **Muted**: `--muted` and `--muted-foreground` - Subtle text and backgrounds
- **Card**: `--card` and `--card-foreground` - Card components
- **Border**: `--border` - Border colors

### Typography
- **Font Sans**: DM Sans (primary font)
- **Font Serif**: Lora (accent font)
- **Font Mono**: IBM Plex Mono (code font)

### Sidebar Variables
- **Sidebar**: `--sidebar` - Sidebar background
- **Sidebar Primary**: `--sidebar-primary` - Active sidebar items
- **Sidebar Border**: `--sidebar-border` - Sidebar borders

### Dark Mode Support
Complete dark theme with all color variables redefined for dark mode.

## Consistent Usage Across All Pages

### 1. Landing Page (`app/page.tsx`)
- ✅ Uses `text-primary`, `text-muted-foreground`
- ✅ Proper gradient backgrounds with CSS variables
- ✅ QFindr branding with Quanby logo

### 2. Dashboard (`app/dashboard/page.tsx`)
- ✅ Uses `bg-background`, sidebar variables
- ✅ Consistent breadcrumb navigation
- ✅ Proper card components with CSS variables

### 3. Projects Page (`app/projects/page.tsx`)
- ✅ Table components using design system
- ✅ Badge components with proper colors
- ✅ Consistent navigation and layout

### 4. Documents Page (`app/documents/page.tsx`)
- ✅ File management interface with proper styling
- ✅ Upload components using design system
- ✅ Consistent with overall theme

### 5. AI Generation Page (`app/ai-generation/page.tsx`)
- ✅ Form components using CSS variables
- ✅ Progress indicators with brand colors
- ✅ Consistent button and input styling

### 6. Workflows Page (`app/workflows/page.tsx`)
- ✅ n8n workflow integration display
- ✅ Status indicators using design system
- ✅ Consistent card and badge styling

### 7. Team Page (`app/team/page.tsx`)
- ✅ User management interface
- ✅ Avatar and role components
- ✅ Consistent table and form styling

### 8. Settings Page (`app/settings/page.tsx`)
- ✅ Configuration forms using design system
- ✅ Toggle and input components
- ✅ Consistent layout and spacing

### 9. Authentication Pages (`app/login/page.tsx`, `app/register/page.tsx`)
- ✅ Form components with proper styling
- ✅ Brand colors and typography
- ✅ Consistent with overall design

### 10. Project Detail Pages (`app/projects/[id]/page.tsx`)
- ✅ Dynamic routing with consistent styling
- ✅ Responsive design using design system
- ✅ Proper sidebar integration

## Component Library Integration

### Sidebar Component (`components/app-sidebar.tsx`)
- ✅ Uses sidebar-specific CSS variables
- ✅ Proper navigation with brand colors
- ✅ QFindr branding with Quanby logo

### UI Components (`components/ui/`)
- ✅ All shadcn/ui components configured to use CSS variables
- ✅ Consistent with design system tokens
- ✅ Responsive design patterns

## Key Benefits

1. **Consistency**: All pages use the same color palette and typography
2. **Maintainability**: Changes to `globals.css` affect entire application
3. **Dark Mode**: Automatic support across all components
4. **Responsive**: Design system includes responsive utilities
5. **Professional**: Clean, modern appearance suitable for government platform

## CSS Variable Usage Examples

```css
/* Text Colors */
.text-primary         /* Main brand color */
.text-muted-foreground /* Subtle text */
.text-foreground      /* Main text color */

/* Backgrounds */
.bg-background        /* Main background */
.bg-card             /* Card backgrounds */
.bg-muted            /* Subtle backgrounds */

/* Borders */
.border-border       /* Standard borders */
.border-input        /* Input borders */

/* Components */
.bg-sidebar          /* Sidebar background */
.text-sidebar-foreground /* Sidebar text */
```

## Branding Consistency

All references to the previous branding have been updated to "QFindr" with the Quanby logo across:
- Page titles and headings  
- Breadcrumb navigation
- Sidebar branding with logo
- Meta tags and SEO
- Component labels and descriptions
- Authentication pages with logo integration

## Next Steps

Your application now has a fully consistent design system. All pages will automatically:
- Respect theme changes (light/dark mode)
- Use consistent spacing and typography
- Maintain brand colors and styling
- Work responsively across devices
- Support accessibility features built into the design system
