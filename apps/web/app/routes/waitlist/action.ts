import {
  handlePreflightRequest,
  validateAndGetCorsHeaders,
  validateRequiredHeaders,
} from "~/lib/action-utils.server";

if (!process.env.LOOPS_API_KEY) {
  throw new Error("LOOPS_API_KEY is not set");
}

async function createLoopsContact(
  email: string,
  properties: Record<string, any>,
  mailingLists: Record<string, boolean>,
) {
  const response = await fetch("https://app.loops.so/api/v1/contacts/create", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
    },
    body: JSON.stringify({
      email,
      ...properties,
      mailingLists,
    }),
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("RATE_LIMIT_EXCEEDED");
    }
    if (response.status === 409) {
      throw new Error("USER_ALREADY_EXISTS");
    }
    throw new Error(
      `Loops API error: ${response.status} ${response.statusText}`,
    );
  }

  return response.json();
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const email = formData.get("email")?.toString()?.trim();
  const firstName = formData.get("firstName")?.toString().trim();
  const lastName = formData.get("lastName")?.toString().trim();
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
    await createLoopsContact(email, properties, mailingLists);
  } catch (error) {
    if (error instanceof Error && error.message === "USER_ALREADY_EXISTS") {
      return {
        success: true,
        errors: null,
        message: "You're already on the waitlist and will get updates",
        formData: {
          firstName,
          lastName,
          email,
        },
      };
    } else if (
      error instanceof Error &&
      error.message === "RATE_LIMIT_EXCEEDED"
    ) {
      // Wait 2 seconds and retry once
      await new Promise((resolve) => setTimeout(resolve, 2000));

      try {
        await createLoopsContact(email, properties, mailingLists);
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
