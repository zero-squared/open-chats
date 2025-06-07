# open-chats

A platform with chats for communication

## Requirements

- Node v22.14.0
- pnpm

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

```bash
pnpm install pm2 -g
pm2 startup
cp .env.prod.example .env # fill .env file
pnpm run setup
pnpm run pm2:start
pm2 save
```