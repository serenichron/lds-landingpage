# Learning Design Solutions Landing Page

## Overview
This is a distinctive Bootstrap-based landing page for Learning Design Solutions, designed following Donald Miller's StoryBrand framework and avoiding generic Bootstrap aesthetics.

## Brand Colors Used
- **Navy Blue**: `#1e3a8a` (Primary)
- **Lime Green**: `#84cc16` (Accent)
- **Coral Orange**: `#f97316` (CTA/Accent)
- **Dark Grey**: `#1f2937` (Text)
- **Light Grey**: `#f9fafb` (Backgrounds)

## Design Characteristics
- **Sharp corners** (no border-radius)
- **Clean typography**: Inter (body) + Libre Baskerville (display headings)
- **Asymmetric layouts** to avoid generic Bootstrap patterns
- **Three-color accent bars** reflecting logo design
- **Academic yet modern** aesthetic

## Required Images

Place these images in the `/images` folder:

### Logo Files (Required)
1. `lds-logo-horizontal-white.png` - Horizontal logo for dark navy navbar
2. `lds-logo-stacked-white.png` - Stacked logo for footer

### Content Images (Recommended)
3. `andrew-doig.jpg` - Professional photo of Andrew Doig for About section
   - Suggested dimensions: 600x600px minimum
   - Should show professionalism and approachability

### Client Logos (Optional but Recommended)
4. You can add individual client logos or use the composite image provided
   - Place in `/images/clients/` subfolder
   - Logos shown: Dyson, ICAS, GCU, Heriot-Watt, Future Learn, Reels, etc.

## StoryBrand Framework Implementation

### 1. Character (The Hero)
Programme Directors, Deans, Digital Learning Managers at well-funded HE institutions

### 2. Problem
- **External**: Need to reach global online learners, limited internal capacity
- **Internal**: Frustration, tension between goals and capacity
- **Philosophical**: "Putting lectures online isn't enough - you need academic transformation"

### 3. Guide
Andrew Doig - 30 years academic experience, former Associate Professor, understands HE culture

### 4. Plan
Four clear steps: Consulting → Piloting → Planning → Building

### 5. Calls to Action
- **Direct**: "Book a Consultation"
- **Transitional**: "Get Free Guide" (lead magnet)

### 6. Failure Stakes
Missing global market, poor-quality courses, stretched teams, damaged reputation

### 7. Success
Maintain institutional identity whilst reaching global audiences with quality programmes

## Section Breakdown

1. **Navigation** - Sticky navy bar with green bottom border
2. **Hero** - Navy gradient background, clear value proposition
3. **Problems** - 6 problem cards with hover effects
4. **What Links Them** - Educational explanation
5. **Empathy Quote** - Bordered quote section
6. **About Andrew** - Navy background, credentials
7. **What's Really Happening** - 3-step cycle
8. **Our Approach** - Asymmetric layout, backwash effect
9. **Process** - 4 numbered steps
10. **Results** - Case study teasers (navy background)
11. **Is This Right?** - Two-column comparison
12. **FAQ** - Accordion with custom styling
13. **Lead Magnet** - Navy section with white form
14. **Contact** - Process + form
15. **Footer** - Dark with green accents

## Language Guidelines

- **British English** throughout
- **CEFR Level A2-B1** (simple, clear sentences)
- **Friendly but professional** tone
- Short paragraphs for readability
- Active voice

## Key Messaging Points

### NOT "Digital Transformation"
Andrew was very clear: LDS does NOT do digital transformation. They do **academic transformation enabled by technology**.

### Core Message
- Clients already have their platforms (VLE/LMS)
- The transformation is pedagogical, not technological
- "You've been teaching in classrooms for 150 years. We're going to rethink your approach to teaching."

### Target Market
- Private universities (fast decision-making)
- Chartered institutes (ICAS model)
- HE-adjacent organisations with funding
- NOT typical UK public universities (too slow procurement)

## Forms

Both forms currently use JavaScript alerts for demonstration. Replace with your actual form handling:

### Lead Magnet Form (`#leadMagnetForm`)
Captures: Name, Email, Institution, Role

### Contact Form (`#contactForm`)
Captures: Name, Email, Institution, Message

## Technical Details

- **Bootstrap 5.3.2** via CDN
- **Google Fonts**: Inter + Libre Baskerville
- Fully responsive (mobile-first)
- Smooth scroll navigation
- No jQuery required (vanilla JavaScript)
- All CSS embedded in `<head>` for single-file deployment

## Deployment to Squarespace

This page was designed to be embedded in Squarespace. Options:

1. **Code Block**: Paste entire HTML into a Code Block
2. **Custom Page**: Use Developer Mode to create custom template
3. **Embed**: Work with Steve (site maintainer) to integrate

### Squarespace Integration Notes
- May need to extract CSS to separate file depending on Squarespace limitations
- Navigation might need adjustment to match existing site nav
- Forms should connect to Squarespace form handlers or external service (e.g., Mailchimp, HubSpot)

## Bootstrap Customization Philosophy

This page demonstrates **distinctive Bootstrap design**:

- ✅ Uses Bootstrap grid and components as foundation
- ✅ Heavily customized colors (not default blue)
- ✅ Custom typography beyond Bootstrap defaults
- ✅ Asymmetric layouts (not generic three-column cards)
- ✅ Sharp corners throughout (not default rounded)
- ✅ Strategic spacing variety (not uniform padding)
- ✅ Hover effects and subtle animations
- ❌ NO generic Bootstrap patterns
- ❌ NO default color schemes
- ❌ NO predictable layouts

## What Makes This Page Different from Generic Bootstrap

1. **Custom Color Scheme**: Navy, green, orange (not Bootstrap blue)
2. **Sharp Aesthetic**: Zero border-radius throughout
3. **Asymmetric Layouts**: Varied column widths, not predictable grids
4. **Typography Hierarchy**: Large display headings vs body creates drama
5. **Accent Bars**: Three-color bars reflect brand identity
6. **Navy Hero**: Dark gradient hero (not light centered content)
7. **Educational Tone**: Academic but modern (not corporate or tech startup)

## Next Steps

1. **Add Images**: Place required images in `/images` folder
2. **Test Forms**: Connect forms to your email/CRM system
3. **Review Copy**: Ensure all messaging aligns with current positioning
4. **Add Analytics**: Insert Google Analytics or tracking code
5. **Test Responsive**: Check on mobile devices
6. **Squarespace Integration**: Work with Steve to embed properly

## Content Updates Needed

- Add actual phone number in contact section
- Add Andrew Doig photo
- Add client logos section (composite image provided)
- Connect forms to actual backend
- Update any institutional names/details as needed

## Maintenance

To update colors, modify CSS variables in `:root`:
```css
:root {
    --lds-navy: #1e3a8a;
    --lds-green: #84cc16;
    --lds-orange: #f97316;
    /* etc */
}
```

## Questions?

Contact Vlad for design/development questions.
Contact Andrew for content/messaging questions.
