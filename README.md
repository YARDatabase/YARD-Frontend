<p align="center">
  <h1 align="center">YARD Frontend</h1>
  <h3 align="center">Yet Another Reforge Database - Web Interface</h3>
</p>

<p align="center">
  A modern web application for browsing and comparing Hypixel SkyBlock reforge stones and reforges.
</p>

**Backend**: [YARD-Backend](../YARD-Backend)

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Configuration](#configuration)
- [Development](#development)
- [Building for Production](#building-for-production)
- [Testing](#testing)
- [Project Structure](#project-structure)

## Overview

YARD Frontend is a Next.js application that provides a user-friendly interface for:
- Browsing reforge stones with detailed information
- Searching and filtering reforges by item type, stat type, and rarity
- Comparing up to 4 reforges side-by-side
- Viewing live market prices from Auction House and Bazaar
- Visualizing stat scaling across different rarities
- Viewing cost breakdowns for reforge applications

## Features

- **Reforge Stones Browser**: Browse all reforge stones with images, stats, effects, and live market prices
- **Reforge Browser**: Search and filter reforges with advanced AND/OR logic, view as cards or table
- **Comparison Tool**: Compare up to 4 reforges side-by-side with visual indicators for best stats
- **Live Prices**: Real-time prices from Auction House and Bazaar with top buy/sell orders
- **Stat Scaling Charts**: Visualize how stats scale across different rarities
- **Cost Breakdowns**: See application costs, stone prices, and total estimated costs
- **Dark Mode**: Built-in theme switching with system preference detection
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

## Requirements

- Node.js 18.0 or later
- npm, yarn, or pnpm package manager

## Installation

Clone the repository:
```bash
git clone https://github.com/YARDatabase/YARD-Frontend.git
cd YARD-Frontend
```

Install dependencies using npm:
```bash
npm install
```

Or using pnpm (recommended):
```bash
pnpm install
```

Or using yarn:
```bash
yarn install
```

## Configuration

### Environment Variables

Create a `.env.local` file in the project root. Use `.env.example` as a template:

```bash
cp .env.example .env.local
```

Edit the `.env.local` file with your configuration:

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8080` | No |

**Example `.env.local`:**
```env
NEXT_PUBLIC_API_URL=http://localhost:8080
```

**Note:** Next.js automatically loads `.env.local` files. Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser.

## Development

Run the development server:
```bash
npm run dev
```

Or using pnpm:
```bash
pnpm dev
```

Or using yarn:
```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

The page will automatically reload when you make changes to the code.

## Building for Production

Build the application for production:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

Or using pnpm:
```bash
pnpm build
pnpm start
```

Or using yarn:
```bash
yarn build
yarn start
```

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

## Project Structure

```
YARD-Frontend/
├── app/                    # Next.js app directory
│   ├── browser/            # Reforge browser page
│   ├── compare/            # Comparison tool page
│   ├── components/         # React components
│   ├── hooks/              # Custom React hooks
│   ├── stones/             # Reforge stones page
│   ├── utils/              # Utility functions
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── public/                 # Static assets
│   └── favicon.png
├── next.config.js          # Next.js configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies and scripts
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage

## Technologies

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React 18** - UI library

## Docker

The frontend can be run using Docker Compose.

### Prerequisites

- Docker and Docker Compose installed on your system

### Quick Start

1. Create a `.env.local` file in the project root (see [Configuration](#configuration) section for details)

2. Build and start the service:
```bash
docker-compose up --build
```

3. The frontend will be available at `http://localhost:3000`

### Docker Compose Commands

- Start service in detached mode:
```bash
docker-compose up -d
```

- Stop service:
```bash
docker-compose down
```

- View logs:
```bash
docker-compose logs -f
```

- Rebuild and restart:
```bash
docker-compose up --build -d
```

### Configuration

Make sure to set `NEXT_PUBLIC_API_URL` in your `.env.local` file to point to your backend API. If running the backend separately, use the appropriate URL (e.g., `http://localhost:8080`).

## Contributing

You are free to report bugs or contribute to this project. Just open [Issues](https://github.com/YARDatabase/YARD-Frontend/issues) or [Pull Requests](https://github.com/YARDatabase/YARD-Frontend/pulls) and the team will look into them.

## License

This project is licensed under the GPL-3.0 License.
