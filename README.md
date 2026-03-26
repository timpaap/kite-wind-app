# 🪁 Kite Wind App

A beautiful, responsive web app for checking wind conditions at Zandvoort aan Zee. Perfect for kiteboard and kite enthusiasts!

## ✨ Features

- 🌬️ **7-Day Wind Forecast** - Real-time wind speed data from Open-Meteo API
- 📊 **Daytime Averages** - Wind speed calculated for 9:00-18:00 hours (optimal kiting time)
- 🎯 **Smart Kite Recommendations**:
  - 10m² Kite for 15-22 knots
  - RRD 7m² for 19-27 knots
  - RRD 5m² for 22-35 knots
- 🟩 **Weekend Highlighting** - Green cards for weekend days with ≥15 knots wind
- 📅 **Apple Calendar Export** - Download `.ics` files for perfect kite days
- 📱 **Fully Responsive** - Works great on mobile, tablet, and desktop

## 🚀 Live Demo

Visit: https://kite-wind-app.vercel.app

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (React framework)
- **Styling**: Tailwind CSS
- **API**: Open-Meteo (free, no API key required)
- **Deployment**: Vercel
- **Version Control**: GitHub

## 📦 Installation & Development

### Prerequisites
- Node.js 18+ installed on your computer
- Git installed

### Setup

1. Clone the repository:
```bash
git clone https://github.com/YOUR_USERNAME/kite-wind-app.git
cd kite-wind-app
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📂 Project Structure

```
kite-app/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page (landing & wind display)
│   │   └── layout.tsx        # App layout
│   ├── components/
│   │   └── WindCard.tsx      # Individual day wind card
│   └── lib/
│       ├── api.ts            # Open-Meteo API integration
│       └── ics-export.ts     # Apple Calendar export
├── public/                   # Static assets
├── DEPLOYMENT_GUIDE.md       # Step-by-step deployment instructions
└── package.json              # Project dependencies
```

## 🌍 Location

Currently configured for **Zandvoort aan Zee, Netherlands** (52.3745°N, 4.5305°E)

To change location, edit `src/lib/api.ts`:
```typescript
const ZANDVOORT_LAT = 52.3745;  // Change latitude
const ZANDVOORT_LNG = 4.5305;   // Change longitude
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

Follow the comprehensive guide in `DEPLOYMENT_GUIDE.md` for step-by-step instructions.

Quick version:
1. Push to GitHub
2. Visit https://vercel.com/new
3. Import your GitHub repository
4. Deploy!

### Manual Deployment

```bash
npm run build
npm start
```

## 🔄 Making Updates

After making changes locally:

```bash
git add .
git commit -m "Your change description"
git push
```

Vercel automatically rebuilds and deploys!

## 🤝 Contributing

Feel free to fork and submit pull requests for any improvements!

## 📝 License

MIT License - feel free to use this for personal or commercial projects.

## ❓ Help & Troubleshooting

See `DEPLOYMENT_GUIDE.md` for troubleshooting and detailed instructions.

## 🙏 Credits

- Wind data powered by [Open-Meteo](https://open-meteo.com/)
- Built with [Next.js](https://nextjs.org/) & [Tailwind CSS](https://tailwindcss.com/)
- Deployed on [Vercel](https://vercel.com/)
