#!/bin/bash

sed -i -e "s/%GOOGLE_MAPS_ANDROID_API_KEY%/$GOOGLE_MAPS_ANDROID_API_KEY/g" config.xml

sed -i -e "s/%GOOGLE_MAPS_ANDROID_API_KEY%/$GOOGLE_MAPS_ANDROID_API_KEY/g" package.json

tail -f /dev/null