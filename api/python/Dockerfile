FROM python:3.9
WORKDIR /app
COPY . .

RUN pip3 install -r requirements.txt
RUN pip install python-dotenv
RUN pip install --upgrade google-cloud-pubsub
RUN python -m pip install mysql-connector

ENV PORT 5000
ENV HOST 0.0.0.0
ENV GOOGLE_APPLICATION_CREDENTIALS="./pubsub.json"
EXPOSE 5000
CMD [ "python3", "-m" , "flask", "run", "--host=0.0.0.0"]