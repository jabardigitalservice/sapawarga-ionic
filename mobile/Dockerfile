#################################
# Development
#################################
FROM beevelop/ionic:latest as build

# Create app folder
RUN mkdir /app
WORKDIR /app

# # Add configuration files
# COPY image-files/ /
# RUN chmod 700 /usr/local/bin/docker-entrypoint-dev.sh
# RUN chmod +x /etc/profile.d/gradle.sh

# # Install gradle
# RUN wget https://services.gradle.org/distributions/gradle-5.0-bin.zip -P /tmp
# RUN unzip -d /opt/gradle /tmp/gradle-*.zip
# RUN /etc/profile.d/gradle.sh

RUN apt-get update && apt-get install apt-transport-https -y
RUN curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

RUN apt-get update && apt-get install yarn -y

COPY . .

# install dependency
RUN yarn

# Accept android license
RUN mkdir "$ANDROID_HOME/licenses"
RUN echo -e "\n24333f8a63b6825ea9c5514f83c2829b004d1fee" > "$ANDROID_HOME/licenses/android-sdk-license"

RUN npm install
RUN rm -rf /platforms

RUN apt update
RUN apt install bash

COPY image-files/ /
RUN chmod 700 /usr/local/bin/docker-entrypoint.sh

# Expose port 4200
EXPOSE 4200

ENTRYPOINT ["docker-entrypoint.sh"]
# CMD ["tail", "-f", "/dev/null"]