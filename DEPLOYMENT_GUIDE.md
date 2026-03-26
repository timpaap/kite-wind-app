# Kite Wind App - Complete Deployment Guide

Welcome! This guide will walk you through deploying your Kite Wind App to Vercel step by step. Don't worry if this is your first time - we'll go through each step carefully.

## 📋 What We've Built

Your kite wind app includes:
- ✅ 7-day wind forecast for Zandvoort aan Zee
- ✅ Open-Meteo API integration (free, no API key needed)
- ✅ Daytime wind averages (9:00-18:00)
- ✅ Kite recommendations based on wind speed
- ✅ Weekend highlighting in green (when wind ≥15 knots)
- ✅ Export to Apple Calendar (.ics files)

## 🚀 Deployment Steps (Part 1: GitHub Setup)

### Step 1: Create a GitHub Account
1. Go to https://github.com
2. Click "Sign up"
3. Choose a username (e.g., your name or a memorable ID)
4. Enter your email
5. Create a password
6. Follow the verification steps
7. (Optional) Fill in your profile

**What is GitHub?** It's a platform where developers store and share code. Vercel can automatically deploy your app whenever you make changes to GitHub.

### Step 2: Create a New Repository on GitHub
1. Log in to GitHub
2. Click the "+" icon in the top right
3. Select "New repository"
4. Name it: `kite-wind-app` (or any name you prefer)
5. Add description: "7-day kite wind forecast for Zandvoort aan Zee"
6. Choose "Public" (so it's accessible)
7. DO NOT check "Initialize with README" (we already have files)
8. Click "Create repository"

**What is a Repository?** It's like a folder in the cloud that stores all your project files and tracks changes.

### Step 3: Connect Your Local Project to GitHub
These commands link your project folder on your computer to the GitHub repository:

```bash
cd /Users/timpaap/Desktop/kite-app
git init
git add .
git commit -m "Initial commit: Kite wind app"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/kite-wind-app.git
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username.**

**What does each command do?**
- `git init` - Initialize git tracking
- `git add .` - Stage all files for upload
- `git commit -m "..."` - Save a snapshot with a message
- `git branch -M main` - Rename branch to main (standard name)
- `git remote add origin ...` - Connect to GitHub
- `git push -u origin main` - Upload to GitHub

### Step 4: Generate a GitHub Personal Access Token
If `git push` asks for a password, use this method:

1. Log in to GitHub
2. Click your profile picture (top right) → "Settings"
3. Scroll down to "Developer settings" (left sidebar)
4. Click "Personal access tokens" → "Tokens (classic)"
5. Click "Generate new token"
6. Name it: `kite-app-token`
7. Check: `repo` (for full control of repositories)
8. Click "Generate token"
9. **Copy the token immediately** (you won't see it again!)
10. Use this token as your password when `git push` asks

## 🔌 Deployment Steps (Part 2: Vercel Setup)

### Step 5: Create a Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account
5. Vercel will create your account automatically

**What is Vercel?** It's a hosting platform that runs Node.js apps. It integrates with GitHub, so every time you push code, your app automatically updates.

### Step 6: Deploy Your App to Vercel
1. Go to https://vercel.com/new
2. Under "Import Git Repository", paste your GitHub repo URL:
   ```
   https://github.com/YOUR_USERNAME/kite-wind-app
   ```
3. Click "Import"
4. Configure project:
   - **Project Name**: `kite-wind-app`
   - **Framework Preset**: Select `Next.js`
   - Leave other settings as default
5. Click "Deploy"

Vercel will now build and deploy your app! It takes 2-5 minutes.

### Step 7: Get Your Live URL
Once deployed:
1. You'll see a "Congratulations!" message
2. Your app is live at a URL like: `https://kite-wind-app.vercel.app`
3. Click the URL to visit your live app
4. Test it - it should show wind data!

## 🔄 Making Changes in the Future

Once everything is set up, updating your app is simple:

1. Edit files in VS Code
2. Save changes
3. Run these commands:
   ```bash
   git add .
   git commit -m "Your change description"
   git push
   ```
4. Vercel automatically rebuilds and deploys! (Watch at vercel.com)

## 📝 Environment Variables (If Needed)

Currently, your app doesn't need any API keys since Open-Meteo is free. But if you add paid services later, you can store secrets in Vercel:

1. Go to your project on Vercel
2. Click "Settings" → "Environment Variables"
3. Add variables (won't be visible in your code)

## ✅ Troubleshooting

**Problem: "git push" fails**
- Make sure you used your GitHub username in the remote URL
- Use a Personal Access Token instead of password
- Check you have internet connection

**Problem: Vercel build fails**
- Check the build logs in Vercel dashboard
- Make sure all files are uploaded to GitHub
- Verify no typos in file names

**Problem: App shows 404**
- Wait a few minutes for Vercel to finish deploying
- Refresh the page
- Check the URL is correct

## 🎉 You're Done!

Your kite wind app is now live and automatically updates whenever you push changes to GitHub. Share your app URL with friends!

## 📚 Next Steps

- Customize the colors in `src/app/page.tsx` and `src/components/WindCard.tsx`
- Add your Vercel app domain as a custom domain (paid feature)
- Add more locations by duplicating the code and changing coordinates
- Share on social media!
