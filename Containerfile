FROM ubuntu:22.04

RUN apt-get update && \
    apt-get install -y python3 python3-pip python-is-python3 redis parallel && \
    apt-get clean clean

RUN pip install -U pip setuptools && pip install poetry

WORKDIR /apps/sunva-backend
ADD poetry.lock pyproject.toml /apps/sunva-backend
RUN poetry install

ADD . /apps/sunva-backend
CMD redis-server & poetry run uvicorn main:app --host 0.0.0.0 && fg
