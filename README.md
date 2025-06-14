# open-chats

A platform with chats for communication

## Requirements

- **Node v22.14.0**
- **pnpm**
- pm2 (for production)

## Installation

```bash
git clone https://github.com/zero-squared/open-chats
cd open-chats
pnpm install
```

### Setup for development

```bash
cp .env.dev.example .env # fill .env file
pnpm run setup
pnpm run dev
```

### Setup for production

```bash
cp .env.prod.example .env # fill .env file
pnpm run setup
pnpm run pm2:start
```