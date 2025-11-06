# Deca Framework

Modern, lightweight UI framework for building beautiful, responsive interfaces with minimal effort.

## 🚀 Quick Start

### Installation

Simply include the CSS file in your HTML:

```html
<link rel="stylesheet" href="./style/styles.css">
```

And the JavaScript file before closing `</body>`:

```html
<script src="./index.js"></script>
```

### Basic Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Project - Deca</title>
    <link rel="stylesheet" href="./style/styles.css">
</head>
<body>
    <!-- Your content here -->
    <script src="./index.js"></script>
</body>
</html>
```

## 📦 Components

### Buttons

Available variants: `btn-primary`, `btn-secondary`, `btn-success`, `btn-danger`, `btn-warning`, `btn-info`

Available sizes: `btn-sm`, default, `btn-lg`

```html
<!-- Primary button -->
<button class="btn btn-primary">Click Me</button>

<!-- Large success button -->
<button class="btn btn-success btn-lg">Submit</button>

<!-- Small secondary button -->
<button class="btn btn-secondary btn-sm">Cancel</button>
```

### Cards

```html
<!-- Simple card -->
<div class="card">
    <div class="card-content">
        <h4>Card Title</h4>
        <p>Card description text goes here.</p>
        <button class="btn btn-primary">Action</button>
    </div>
</div>

<!-- Card with image -->
<div class="card">
    <img src="image.jpg" alt="Card" class="card-image">
    <div class="card-content">
        <h4>Card with Image</h4>
        <p>Description text.</p>
        <button class="btn btn-primary">Read More</button>
    </div>
</div>

<!-- Featured card -->
<div class="card card-featured">
    <div class="card-content">
        <span class="badge badge-primary">Featured</span>
        <h4>Special Card</h4>
        <p>This card stands out!</p>
    </div>
</div>
```

### Grid System

Responsive column layout using CSS Grid:

```html
<div class="columns">
    <div class="column">
        <!-- Content for column 1 -->
    </div>
    <div class="column">
        <!-- Content for column 2 -->
    </div>
    <div class="column">
        <!-- Content for column 3 -->
    </div>
</div>
```

The grid automatically adjusts based on screen size:
- **Desktop**: 3 columns (or as many as fit)
- **Tablet**: 2 columns
- **Mobile**: 1 column

### Alerts

Available types: `alert-success`, `alert-info`, `alert-warning`, `alert-danger`

```html
<div class="alert alert-success">
    <strong>Success!</strong> Your action completed successfully.
</div>

<div class="alert alert-danger">
    <strong>Error!</strong> Something went wrong.
</div>
```

### Forms

```html
<form class="form">
    <div class="form-group">
        <label for="email">Email Address</label>
        <input type="email" id="email" class="form-control" placeholder="you@example.com">
    </div>
    
    <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" class="form-control" rows="4"></textarea>
    </div>
    
    <div class="form-group">
        <label class="checkbox">
            <input type="checkbox">
            <span>I agree to the terms</span>
        </label>
    </div>
    
    <button type="submit" class="btn btn-primary">Submit</button>
</form>
```

### Badges

Available variants: `badge-primary`, `badge-secondary`, `badge-success`, `badge-danger`, `badge-warning`, `badge-info`

```html
<span class="badge badge-primary">Primary</span>
<span class="badge badge-success">Success</span>
<span class="badge badge-danger">Danger</span>
```

### Navigation

```html
<nav>
    <div class="nav-container">
        <div class="logo">Brand</div>
        <div class="menu-toggle">
            <span></span>
            <span></span>
            <span></span>
        </div>
        <ul class="nav-links">
            <li><a href="#home">Home</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
        </ul>
    </div>
</nav>
```

Mobile menu toggle is handled automatically by the JavaScript.

### Hero Section

```html
<section class="hero">
    <div class="hero-content">
        <h1>Your Headline</h1>
        <p>Your description text goes here.</p>
        <div class="hero-buttons">
            <button class="btn btn-primary">Get Started</button>
            <button class="btn btn-secondary">Learn More</button>
        </div>
    </div>
</section>
```

## 🎨 Customization

### CSS Variables

Customize colors by overriding CSS variables:

```css
:root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --secondary: #8b5cf6;
    --success: #10b981;
    --danger: #ef4444;
    --warning: #f59e0b;
    --info: #3b82f6;
    --dark: #0f172a;
    --gray: #64748b;
    --light: #f1f5f9;
    --white: #ffffff;
}
```

### Typography

Default font stack:
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
```

## 📱 Responsive Design

All components are mobile-first and fully responsive:

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## 🎯 Features

- ✅ Lightweight (< 15KB minified CSS)
- ✅ No dependencies
- ✅ Mobile-first responsive design
- ✅ Modern gradient effects
- ✅ Smooth animations
- ✅ Button ripple effects
- ✅ Intersection Observer animations
- ✅ Smooth scrolling

## 📂 File Structure

```
deca-framework/
├── index.html              # Main documentation page
├── components-reference.html  # Complete components reference
├── example-landing.html    # Landing page example
├── example-dashboard.html  # Dashboard example
├── index.js               # JavaScript functionality
└── style/
    └── styles.css         # All CSS styles
```

## 🔧 JavaScript Features

The framework includes built-in JavaScript for:

1. **Mobile Menu Toggle** - Hamburger menu for mobile devices
2. **Smooth Scrolling** - Smooth anchor link navigation
3. **Button Ripple Effects** - Material Design-inspired ripples
4. **Intersection Observer** - Scroll animations for columns and cards
5. **Form Handling** - Basic form submission handling

## 💡 Usage Tips

1. Always wrap content in `.docs` or `.nav-container` for proper max-width and centering
2. Use `.columns` for automatic responsive layouts
3. Combine utility classes for custom styling
4. All components work independently - use what you need
5. JavaScript is optional for static sites

## 🌟 Examples

Check out the included example files:

- `index.html` - Main documentation with all components
- `components-reference.html` - Detailed component reference
- `example-landing.html` - Complete landing page
- `example-dashboard.html` - Admin dashboard example

## 📄 License

Free to use for personal and commercial projects.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

---

Built with ❤️ for developers who value simplicity and elegance.