name=${1:-"console-logging-server"}
port=${2:-3000}
docker build -t console-logging-server .
docker container rm -f -v $name
docker container run --name $name -d -p $port:80 console-logging-server

