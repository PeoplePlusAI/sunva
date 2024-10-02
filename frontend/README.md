# Sunva AI Front End

Having conversations with the deaf can be a challenge. While there are so many live transcription and text to speech
tools available in the market, they do not cater to the needs of the deaf and hard of hearing and aren't designed from
accessibility focus. Often it could take a lot of time for the deaf person to read transcriptions and respond to them
depending on various factors from person to person. SUNVA AI intelligently simplifies and provides various filters on
the transcriptions to minimize the amount of time taken to read transcription and switch gaze between the screen and the
person while having the communication.

## Getting Started

1. To get started, clone the repository.
2. Install the dependencies using `npm install` or `yarn install` or `pnpm install` or `bun install`
    > The project uses `pnpm` as the package manager, but any of them can be used.
3. Create `.env.local` file in the root of the project and add the following environment variables:
    ```env
   NEXT_PUBLIC_BACKEND=http://localhost:8000
   NEXT_PUBLIC_WS_BACKEND=ws://localhost:8000
    ```
   > The `NEXT_PUBLIC_BACKEND` and `NEXT_PUBLIC_WS_BACKEND` are the URLs of the backend server, it shouldn't end with '/'
   Change the value to the desired backend URL.
4. The to start the development server, run the following command:
    ```bash
    npm run dev
    # or
    yarn dev
    # or
    pnpm dev
    # or
    bun dev
    ```
5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result. 

The sunva-ai backend is available at https://github.com/PeoplePlusAI/sunva-ai

