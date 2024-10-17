# SUNVA AI: Seamless conversation loop for the deaf

## Table of Contents

- [Introduction](#introduction)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [Documentation](#documentation)
- [Issues](#issues)
- [Pull Requests](#pull-requests)
- [Volunteer](#volunteer)


## Introduction

Having conversations leveraging existing communication tools can be a challenge for deafs. While so many live transcription and text-to-speech tools are available in the market, they do not cater to the needs of the deaf and hard of hearing and aren't designed with an accessibility focus. 

We are building this focusing on the problem deaf people are facing in India by building prototypes, testing it with the deaf community, and iterating based on the feedback.

### STT 

Often it could take a lot of time for the deaf person to read transcriptions and respond to them depending on various factors from person to person. SUNVA AI intelligently simplifies and provides various filters on the transcriptions to minimize the time taken to read the transcription and switch gaze between the screen and the person while communicating.

### TTS

SUNVA AI provides a text-to-speech + LLM layer features that help the deaf person having speech irregularities to type less and respond more. For example, if the deaf person types "I coffee", SUNVA AI will convert it to "I would like to have a coffee" and speak it out.

### Sunva Frontend

[Sunva frontend](https://github.com/PeoplePlusAI/sunva-frontend) is a single-screen UI where you can read the intelligently simplified transcriptions and write your response, which will be spoken back in the selected speech. Our idea is to build this app, take it to our deaf community volunteers, and based on their feedback, iterate the UI to make it even better. 
  

## SUNVA AI workplan 

The [first version of the POC](https://www.figma.com/proto/xK0fvVJL9wRWTkwdBeRu2U/Sunva.Ai?page-id=84%3A803&node-id=84-805&viewport=917%2C520%2C0.14&t=ZpNPT9hGNjHWzrqy-1&scaling=min-zoom&content-scaling=fixed&starting-point-node-id=84%3A805&show-proto-sidebar=1) will have the following features along with speaker diarization and text to speech. 

1. Text (transcript) simplification using LLM
2. Text highlighting of important and critical keywords (transcript) using LLM
3. Intelligently apply simplification/highlighting to the transcriptions and provide easy summarizations.

Based on the user feedback from our focus groups, we will refine and add more features to the POC.

## Getting Started

1. Clone the repository: `git clone https://github.com/PeoplePlusAI/sunva,git`

2. For running locally run the instructions in frontend and backend in two tabs

3. Go to localhost:3000 and you will see the application
   
4. For prod run the commands in `build.sh` 

## Contributing

We welcome contributions from the community. To contribute to this project, please follow the guidelines outlined in [CONTRIBUTING.md](.github/CONTRIBUTING.md).

## Documentation

Explain where to find and how to use your project's documentation:

The `docs` folder contains project documentation and related documents. To access or contribute to the documentation, please refer to [docs/README.md](docs/README.md).

## Issues

Provide instructions for reporting issues:

If you encounter any issues with the project, please create a new issue using the [issue template](.github/ISSUE_TEMPLATE.md). Provide as much detail as possible to help us understand and resolve the issue.



## Volunteer & contribute

If you are interested in volunteering for this project, please refer to [this link](https://peopleplus.ai/volunteer) for more information. 

If you would like to contribute to the codebase, please refer to the [CONTRIBUTING.md](.github/CONTRIBUTING.md) file for more information. We appreciate your contributions!


## About Us

People+ai connects do-ers, dreamers, tinkerers and innovators with ideas & resources to build an ecosystem that can empower a billion people to reach their potential - [Know More](https://peopleplus.ai/)

Made with ♥️ for 🇮🇳 by Team People+AI
