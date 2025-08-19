import { LoopsClient, RateLimitExceededError } from "loops";

import {
  handlePreflightRequest,
  validateAndGetCorsHeaders,
  validateRequiredHeaders,
} from "~/lib/action-utils.server";

const loops = new LoopsClient(process.env.LOOPS_API_KEY || "");

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString();
  const firstName = formData.get("firstName")?.toString();
  const lastName = formData.get("lastName")?.toString();
  const honeyPot = formData.get("from_email")?.toString();

  // Validate required headers
  validateRequiredHeaders(request);
  const responseHeaders = validateAndGetCorsHeaders(request);

  // For preflight requests
  if (request.method === "OPTIONS") {
    return handlePreflightRequest(request.headers.get("origin")!);
  }

  if (honeyPot) {
    return {
      success: false,
      errors: {
        email: "We are not able to process your request at this time",
      },
      formData: {
        firstName,
        lastName,
        email,
      },
    };
  }

  if (!email) {
    return {
      success: false,
      errors: {
        email: !email ? "Email is required" : null,
      },
      formData: {
        firstName,
        lastName,
        email,
      },
    };
  }

  const source = "waitlist";
  const userGroup = "waitlist";

  const properties = {
    firstName: firstName || "",
    lastName: lastName || "",
    source,
    userGroup,
  };

  const mailingLists = {
    clyzvcr6m00i00mk148hv4t9g: true,
  };

  try {
    await loops.createContact(email, properties, mailingLists);
  } catch (error) {
    if (error instanceof RateLimitExceededError) {
      // Wait 2 seconds and retry once
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        await loops.createContact(email, properties, mailingLists);
      } catch (retryError) {
        console.error("Loops API retry failed:", retryError);
        return {
          success: false,
          errors: {
            email: "Service temporarily unavailable. Please try again later.",
          },
          formData: {
            firstName,
            lastName,
            email,
          },
        };
      }
    } else {
      console.error("Loops API error:", error);
      return {
        success: false,
        errors: {
          email: "Failed to process your request. Please try again.",
        },
        formData: {
          firstName,
          lastName,
          email,
        },
      };
    }
  }

  return {
    success: true,
    errors: null,
    message: "You're all set! Welcome to the Rec waitlist.",
    formData: {
      firstName,
      lastName,
      email,
    },
    headers: responseHeaders,
  };
}
