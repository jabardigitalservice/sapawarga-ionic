# SapaWarga Mobile App

## Build Image and Run Container

Go to `mobile` subdirectory

```bash
$ cd mobile
```

## Before use this App

Copy `.env-sample` to `.env` and input with your Google Map API Key

```bash
cp .env-sample .env
nano .env
```

Build and run container

```bash
$ docker-compose up -d
```
or, to force rebuild, run
```bash
$ docker-compose up -d --build
```

Go inside the container

```bash
$ docker-compose exec app bash
```

## Run in Browser

Inside the container, run

```bash
$ npm run start
```

Open your browser on http://localhost:4200

## Build APK

Inside the container, run

```bash
$ ionic cordova build android --prod
```
