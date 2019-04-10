# SapaWarga Mobile App

## Build Image and Run Container

Go to `mobile` subdirectory

```bash
$ cd mobile
```

Build and run container

```bash
$ docker-compose up -d
```

Go inside the container

```bash
$ docker exec -it mobile_app_1 bash
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