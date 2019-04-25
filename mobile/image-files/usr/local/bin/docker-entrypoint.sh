#!/bin/bash

while read a ; do echo ${a//%GOOGLE_MAPS_ANDROID_API_KEY%/$GOOGLE_MAPS_ANDROID_API_KEY} ; done < config.xml > config.xml.t ; mv config.xml.t config.xml

while read a ; do echo ${a//%GOOGLE_MAPS_ANDROID_API_KEY%/$GOOGLE_MAPS_ANDROID_API_KEY} ; done < package.json > package.json.t ; mv package.json.t package.json

tail -f /dev/null