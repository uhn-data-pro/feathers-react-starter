FROM docker.elastic.co/beats/filebeat:7.8.1

USER root

RUN chown root:filebeat /usr/share/filebeat/filebeat.yml
RUN mkdir /usr/share/filebeat/dockerlogs

USER filebeat
