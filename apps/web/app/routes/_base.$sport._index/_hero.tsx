import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useFetcher } from "react-router";

import { waitlistSchema, type WaitlistForm } from "~/lib/form-schemas";
import { cn } from "~/lib/utils";
import { EmailNotification } from "~/primitives/icons";
import { Text } from "~/primitives/text";
import { Button } from "~/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/ui/form";
import { Input } from "~/ui/input";
import { LayoutSection } from "~/ui/layout";

import type { action } from "../waitlist/action";
import type { Route } from "./+types/route";

export function Hero() {
  const data = useLoaderData<Route.ComponentProps["loaderData"]>();
  const fetcher = useFetcher<typeof action>();
  const content = data.hero;
  const disabled = fetcher.state === "submitting";

  const form = useForm<WaitlistForm>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      from_email: "",
    },
  });

  function onSubmit(values: WaitlistForm) {
    const formData = new FormData();
    formData.append("email", values.email);
    if (values.firstName) formData.append("firstName", values.firstName);
    if (values.lastName) formData.append("lastName", values.lastName);
    if (values.from_email) formData.append("from_email", values.from_email);

    fetcher.submit(formData, {
      method: "post",
      action: "/waitlist",
    });
  }

  useEffect(() => {
    if (fetcher.data?.success) {
      form.reset();
    } else if (fetcher.data?.errors) {
      // Set server-side errors
      Object.entries(fetcher.data.errors).forEach(([field, error]) => {
        if (error) {
          form.setError(field as keyof WaitlistForm, {
            type: "server",
            message: error,
          });
        }
      });
    }
  }, [fetcher.data, form]);

  return (
    <LayoutSection className="min-h-[70vh] relative">
      <div className="flex flex-col gap-4 max-w-xl z-10 relative">
        <Text as="h1" variant="headline-2">
          {content.headline}
        </Text>
        <Text as="p" variant="h3" weight="normal" className="text-gray-700">
          {content.deck}
        </Text>

        {fetcher.data?.success ? (
          <div className="flex flex-row gap-4 items-center bg-green-50 border-green-700/20 border-2 rounded-2xl p-6">
            <EmailNotification className="w-12 h-12 text-green-700" />
            <div>
              <Text as="p" variant="h3" className="text-green-700">
                {fetcher.data.message ||
                  "You're all set! Welcome to the Rec waitlist."}
              </Text>
              <Text
                as="p"
                variant="h6"
                weight="light"
                className="text-green-600 mt-1"
              >
                Check your email for updates and early access info.
              </Text>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form
              id="waitlist-email-only-form"
              name="waitlist-email-only-form"
              className="flex flex-row gap-2"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="Email Address"
                          disabled={disabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="from_email"
                render={({ field }) => (
                  <FormItem className="hidden" aria-hidden>
                    <FormControl>
                      <Input
                        type="text"
                        autoComplete="off"
                        tabIndex={-1}
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <Button type="submit" className="self-start" disabled={disabled}>
                Join the Waitlist
              </Button>
            </form>
          </Form>
        )}
      </div>

      <div className="aspect-[4/3] mt-4 -mb-24 -mx-24 lg:m-0 lg:absolute lg:-inset-y-24 lg:left-1/2 overflow-hidden z-0 flex flex-col justify-center items-start">
        <img
          src={content.imgSrc}
          alt={content.imgAlt}
          className={cn("w-full h-auto")}
        />
      </div>
    </LayoutSection>
  );
}
