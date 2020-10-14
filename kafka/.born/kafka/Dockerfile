FROM ubuntu:bionic
RUN apt update -y

RUN  apt install default-jdk -y
RUN  java -version

RUN apt install wget tar -y

#install kafka
RUN wget https://www-us.apache.org/dist/kafka/2.4.0/kafka_2.12-2.4.0.tgz
RUN tar -xzf kafka_2.12-2.4.0.tgz
RUN mv kafka_2.12-2.4.0 kafka && mkdir -p /app/kafka && mv kafka /app
RUN rm -f kafka_2.12-2.4.0.tgz

CMD /app/kafka/bin/kafka-server-start.sh  /app/kafka/config/server.properties

WORKDIR app
EXPOSE 9092 2181
