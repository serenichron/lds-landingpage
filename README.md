# Learning Design Solutions - Landing Page

A professional, modern landing page for Learning Design Solutions built with Bootstrap 5 and following the StoryBrand framework.

## Features

- **Responsive Design**: Fully responsive across all devices (mobile, tablet, desktop)
- **Modern UI**: Clean, professional design with smooth animations and transitions
- **Bootstrap 5**: Built with the latest Bootstrap framework for reliability and browser compatibility
- **SEO Optimized**: Proper meta tags and semantic HTML structure
- **Fast Loading**: Optimized images and minimal dependencies
- **Accessible**: Follows web accessibility best practices

## Technology Stack

- HTML5
- CSS3 (Custom styles with CSS Variables)
- Bootstrap 5.3.2
- Bootstrap Icons
- Google Fonts (Playfair Display & Inter)
- Vanilla JavaScript

## Structure

```
lds-landingpage/
├── index.html          # Main landing page
├── css/
│   └── style.css      # Custom styles
├── js/
│   └── main.js        # Interactive functionality
└── README.md          # Project documentation
```

## Sections

1. **Navigation Bar** - Sticky navigation with CTA button
2. **Hero Section** - Compelling headline with primary and secondary CTAs
3. **Pain Points** - Three key challenges identified
4. **Empathy Bridge** - Connection and understanding
5. **Testimonial** - Social proof from ICAS
6. **Reframe** - Problem redefinition
7. **Guide Introduction** - About Andrew Doig
8. **Solution/Methodology** - Three-pillar approach
9. **Process** - Four-step journey
10. **Results** - Six transformation outcomes
11. **Case Studies** - ICAS, Dyson Institute, GCU
12. **Audience Qualifier** - Ideal client fit assessment
13. **FAQ** - Six common questions
14. **Final CTA** - Primary conversion point
15. **Lead Magnet** - Email capture with guide download
16. **Footer** - Site links and contact information

## Design System

### Colors
- Primary: Teal (#0a7e8c)
- Accent: Gold/Beige (#d4a574)
- Background: Light gray (#f8f9fa)
- Text: Dark (#1a1a1a)

### Typography
- Headings: Playfair Display (Serif)
- Body: Inter (Sans-serif)

### Components
- Gradient buttons with hover effects
- Card-based layouts with shadows
- Smooth scroll animations
- Responsive accordion for FAQ
- Mobile-friendly navigation

## Customization

### To Update Content
Edit the `index.html` file to modify text, images, or links.

### To Change Colors
Update CSS variables in `css/style.css`:
```css
:root {
    --primary-color: #0a7e8c;
    --accent-color: #d4a574;
    /* etc. */
}
```

### To Add Images
Replace placeholder image URLs with actual images:
- Hero image
- Andrew Doig profile photo
- Client logos

## Integration Points

The following elements need backend integration:

1. **Consultation Booking**: Connect CTA buttons to Calendly or booking system
2. **Lead Magnet Form**: Connect email form to CRM/email marketing platform
3. **Analytics**: Add Google Analytics or other tracking codes
4. **Case Study Links**: Link to actual case study pages when available

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance

- Minimal dependencies (Bootstrap CDN, Google Fonts)
- Optimized images recommended
- Fast page load times
- Smooth animations

## Deployment

Simply upload all files to your web server, maintaining the folder structure. The page uses CDN resources for Bootstrap and fonts, so no build process is required.

## License

© 2025 Learning Design Solutions Ltd. All rights reserved.
