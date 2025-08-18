# Use the official MySQL image
FROM mysql:8.0

# Set default environment variables (can be overridden at runtime)
ENV MYSQL_ROOT_PASSWORD=rootpassword
ENV MYSQL_DATABASE=crewai
ENV MYSQL_USER=user
ENV MYSQL_PASSWORD=pass1

# Expose MySQL default port
EXPOSE 3306

