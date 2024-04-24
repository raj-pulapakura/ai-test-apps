import { OpenAI } from "openai";
import { createAI, getMutableAIState, render } from "ai/rsc";
import { z } from "zod";
import ImageCard from "@/components/ui/image/ImageCard";
import { getImages } from "@/fetch/images";
import BotMessage from "@/components/ui/message/BotMessage";
import ImageGrid from "@/components/ui/image/ImageGrid";
import ClipLoader from "react-spinners/ClipLoader";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function submitUserMessage(userInput: string): Promise<UIStateMessage> {
  "use server";

  const aiState = getMutableAIState<typeof AI>();

  // Update the AI state with the new user message.
  aiState.update([
    ...aiState.get(),
    {
      role: "user",
      content: userInput,
      name: "placeholder",
    },
  ]);

  // The `render()` creates a generated, streamable UI.
  const ui = render({
    model: "gpt-4-turbo",
    provider: openai,
    messages: [
      { role: "system", content: "You are a image/photography assistant" },
      ...aiState.get(),
    ],
    // `text` is called when an AI returns a text response (as opposed to a tool call).
    // Its content is streamed from the LLM, so this function will be called
    // multiple times with `content` being incremental.
    text: ({ content, done }) => {
      // When it's the final content, mark the state as done and ready for the client to access.
      if (done) {
        aiState.done([
          ...aiState.get(),
          {
            role: "assistant",
            content,
            name: "placeholder",
          },
        ]);
      }

      return <BotMessage>{content}</BotMessage>;
    },
    tools: {
      get_image_details: {
        description:
          "Get the required details to fetch images from Unsplash API",
        parameters: z
          .object({
            query: z.string().describe("the description of the image"),
            numImages: z.number().describe("the number of images to return"),
          })
          .required(),
        render: async function* ({ query, numImages }) {
          // Show a spinner on the client while we wait for the response.
          yield (
            <ClipLoader
              color={"white"}
              loading={true}
              size={20}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          );

          // Fetch the flight information from an external API.
          const imageUrls = await getImages({ query, per_page: numImages });

          // Update the final AI state.
          aiState.done([
            ...aiState.get(),
            {
              role: "assistant",
              content: `Here are the images I found for you:`,
              name: "placeholder",
            },
            {
              role: "function",
              name: "get_image_details",
              content: JSON.stringify({ query, numImages, imageUrls }),
            },
          ]);

          return (
            <div className="w-full">
              <BotMessage>Here are the images I found for you:</BotMessage>
              <ImageGrid imageUrls={imageUrls} />
            </div>
          );
        },
      },
    },
  });

  return {
    id: Date.now(),
    display: ui,
  };
}

interface AIStateMessage {
  role: "user" | "assistant" | "system" | "function";
  content: string;
  name: string;

  id?: string;
}

// Define the initial state of the AI. It can be any JSON object.
const initialAIState: AIStateMessage[] = [];

interface UIStateMessage {
  id: number;
  display: React.ReactNode;
}

// The initial UI state that the client will keep track of, which contains the message IDs and their UI nodes.
const initialUIState: UIStateMessage[] = [];

// AI is a provider you wrap your application with so you can access AI and UI state in your components.
export const AI = createAI({
  actions: {
    submitUserMessage,
  },
  // Each state can be any shape of object, but for chat applications
  // it makes sense to have an array of messages. Or you may prefer something like { id: number, messages: Message[] }
  initialUIState,
  initialAIState,
});
