# The Gardenia - Luxury Apartment Landing Page

## Original Problem Statement
Create a landing page for an upcoming apartment website called 'The Gardenia'. It is a luxurious apartment with facilities like pool, nature trail situated in Bhubaneswar and price starts at just 1.3 crore.

## User Personas
1. **Home Buyers**: Families and individuals looking for luxury apartments in Bhubaneswar
2. **Investors**: Real estate investors seeking premium properties
3. **Site Visitors**: Potential customers browsing and comparing luxury apartments

## Core Requirements (Static)
- Single-page landing site with smooth scroll navigation
- Hero section with compelling visuals and CTAs
- Comprehensive amenity showcase
- Visual gallery with lightbox
- Floor plans with pricing details
- Location information with map
- Contact form for inquiries and site visit scheduling
- Professional footer with social links
- Mobile responsive design
- Nature-inspired luxury aesthetic (emerald/green theme)

## Architecture & Tech Stack
- **Frontend**: React 19, Tailwind CSS, Shadcn UI components
- **Backend**: FastAPI, Python (to be implemented)
- **Database**: MongoDB (to be implemented)
- **Image Storage**: Unsplash URLs (current), to be replaced with actual property images

## What's Been Implemented (December 24, 2025)

### Phase 1: Frontend with Mock Data ✓
1. **Components Created**:
   - Header (fixed navigation with smooth scroll)
   - Hero (full-screen with CTAs)
   - Amenities (featured + grid layout)
   - Gallery (masonry layout with lightbox)
   - FloorPlans (3 tiers with pricing)
   - Location (map + nearby landmarks)
   - Contact (form + contact info)
   - Footer (comprehensive with social links)

2. **Mock Data Structure** (`/app/frontend/src/mock/data.js`):
   - Hero content
   - 8 amenities (2 with images, 6 with icons)
   - 5 gallery images
   - 3 floor plans (2BHK, 3BHK, 4BHK)
   - Location data with 4 nearby landmarks
   - Contact information
   - Mock form handlers (localStorage-based)

3. **Design Features**:
   - Emerald green theme (nature-inspired)
   - Lucide-react icons throughout
   - Smooth scroll navigation
   - Hover effects and micro-animations
   - Responsive grid layouts
   - Professional typography and spacing

## API Contracts (To Be Implemented)

### Backend Endpoints Needed:
1. `POST /api/contact` - Submit contact form
2. `POST /api/site-visit` - Schedule site visit
3. `GET /api/floor-plans` - Fetch floor plans
4. `GET /api/gallery` - Fetch gallery images
5. `POST /api/newsletter` - Newsletter subscription
6. `GET /api/amenities` - Fetch amenities list

### Database Models:
1. **Contact**: name, email, phone, message, preferredDate, preferredTime, timestamp
2. **SiteVisit**: name, email, phone, visitDate, visitTime, status, timestamp
3. **Newsletter**: email, subscribed, timestamp
4. **FloorPlan**: type, area, price, bedrooms, bathrooms, features, available
5. **Gallery**: imageUrl, title, category, order

## Prioritized Backlog

### P0 (High Priority)
- [ ] Backend development (API endpoints + MongoDB integration)
- [ ] Contact form backend integration
- [ ] Site visit scheduling backend
- [ ] Form validation and error handling
- [ ] Email notifications for inquiries

### P1 (Medium Priority)
- [ ] Admin dashboard for managing inquiries
- [ ] Gallery image management
- [ ] Floor plan availability tracking
- [ ] Analytics integration
- [ ] SEO optimization

### P2 (Nice to Have)
- [ ] Virtual tour integration
- [ ] Live chat support
- [ ] Property comparison tool
- [ ] Mortgage calculator
- [ ] Testimonial carousel with real reviews

## Next Action Items
1. Get user confirmation to proceed with backend development
2. Implement FastAPI endpoints for contact form and site visits
3. Set up MongoDB models for data persistence
4. Integrate frontend with backend APIs
5. Replace mock data with database calls
6. Add form validation and error handling
7. Test end-to-end functionality

## Notes
- All mock data currently stored in localStorage for demo
- Images sourced from Unsplash (production will need actual property photos)
- No backend integration yet - frontend fully functional with mock data
- Design follows luxury real estate standards with nature theme
