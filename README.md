# Atieh Armin - Portfolio Website

A professional portfolio website showcasing AI research, education, projects, and skills.

## 🚀 Deploy to GitHub Pages

Follow these steps to deploy your portfolio to `https://atieharmin.github.io`:

### Step 1: Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in to your account
2. Click the **+** icon in the top right and select **New repository**
3. **Important**: Name your repository exactly `atieharmin.github.io`
   - This special naming convention enables GitHub Pages to host at your root domain
4. Set the repository to **Public**
5. Do **NOT** initialize with README (we already have one)
6. Click **Create repository**

### Step 2: Push Your Code

Open your terminal and run these commands:

```bash
# Navigate to your portfolio directory
cd /Users/atieharmin/atieh-armin-portfolio

# Initialize git repository
git init

# Add all files
git add .

# Commit your changes
git commit -m "Initial commit: Portfolio website"

# Add your GitHub repository as remote
git remote add origin https://github.com/atieharmin/atieharmin.github.io.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages

1. Go to your repository on GitHub: `https://github.com/atieharmin/atieharmin.github.io`
2. Click **Settings** (gear icon)
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **Deploy from a branch**
5. Under **Branch**, select `main` and `/ (root)`
6. Click **Save**

### Step 4: Access Your Website

After a few minutes, your portfolio will be live at:

🌐 **https://atieharmin.github.io**

## 📁 Project Structure

```
atieh-armin-portfolio/
├── index.html      # Main HTML file with all sections
├── styles.css      # All styling (dark theme, animations, responsive)
├── script.js       # JavaScript for interactions and animations
└── README.md       # This file
```

## ✨ Features

- **Responsive Design**: Looks great on desktop, tablet, and mobile
- **Dark Theme**: Elegant dark color scheme with warm gold accents
- **Smooth Animations**: Scroll-triggered reveal animations
- **Modern Typography**: Cormorant Garamond for headlines, Source Sans for body
- **Fast Loading**: Pure HTML/CSS/JS, no frameworks needed
- **SEO Friendly**: Semantic HTML structure

## 🎨 Customization

### Updating Content

Edit `index.html` to update:
- Personal information
- Research experience
- Projects
- Skills
- Contact details

### Changing Colors

Edit the CSS variables in `styles.css`:

```css
:root {
    --accent-primary: #d4a574;    /* Main accent color */
    --accent-secondary: #e8c4a0;  /* Secondary accent */
    --bg-primary: #0a0a0b;        /* Main background */
    /* ... more variables */
}
```

### Adding a Profile Photo

To add a profile photo to the hero section:

1. Add your image file to the project folder
2. In `index.html`, replace the `.hero-visual` div content:

```html
<div class="hero-visual">
    <img src="your-photo.jpg" alt="Atieh Armin" class="hero-photo">
</div>
```

3. Add styles in `styles.css`:

```css
.hero-photo {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid var(--accent-primary);
}
```

## 🔄 Making Updates

After making changes to your portfolio:

```bash
git add .
git commit -m "Update: description of changes"
git push
```

GitHub Pages will automatically redeploy your site within a few minutes.

## 📝 License

This portfolio is for personal use by Atieh Armin.

---

Built with ❤️ for showcasing AI research

