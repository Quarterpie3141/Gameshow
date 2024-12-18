set -e
# redis and other packages are only avalible on the community edge mirrors 
printf "\n\n\n!!! Enable a community repository or the installation WILL fail !!! \n"
# need to configure openrc services to have sever start on boot
printf "!!! Run as root or the installation WILL fail !!! \n\n\n"
sleep 2
printf "Starting URC gameshow buzzer server installation \n\n"

cd /root #why

printf "Installing Redis\n\n"

apk --no-cache --update add redis


printf "\n Configuring Redis\n\n"
# creating and populating a redis config file
mkdir /etc/redis && touch /etc/redis/redis.conf
echo "#URC gameshow server redis configuration" | tee -a /etc/redis/redis.conf
echo "protected-mode no" | tee -a /etc/redis/redis.conf
echo "requirepass urcgameshow" | tee -a /etc/redis/redis.conf
echo "logfile "/var/log/redis/redis.log"" | tee -a /etc/redis/redis.conf
echo "loglevel notice" | tee -a /etc/redis/redis.conf

# adding this variable to the redis conf.d file so redis-server can locate the config file we made above
echo "cfgfile="/etc/redis/redis.conf"" | tee -a /etc/conf.d/redis

# add redis-server as a rc service(we dont have to dameonize redis since rc acts as its supervisor)
rc-update add redis default
rc-service redis start

printf "\n Configuring NTP server\n\n"

apk add chrony

# this enables and starts chrony with no authentication or restrictions
rc-service chronyd start
rc-update add chronyd

printf "\n Installing URC Gameshow server\n\n"

apk add git
# pull the gameshow code from github
git clone https://github.com/Quarterpie3141/Gameshow.git

apk del git
#install node, yarn and download the dependencies
apk add nodejs
apk add yarn

cd ./Gameshow/server

yarn -i --prod # exclude dev dependencies

node ./dist/index.js