import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useLoaderData, useFetcher } from "react-router";

import { waitlistSchema } from "~/lib/form-schemas";
import type { WaitlistForm } from "~/lib/form-schemas";
import { cn } from "~/lib/utils";
import { EmailNotification } from "~/primitives/icons";
import { Text } from "~/primitives/text";
import type { action } from "~/routes/waitlist/action";
import { Alert, AlertTitle, AlertDescription } from "~/ui/alert";
import { Button } from "~/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "~/ui/form";
import { Input } from "~/ui/input";
import { LayoutSection } from "~/ui/layout";

import type { Route } from "./+types/route";

export function Hero() {
  const data = useLoaderData<Route.ComponentProps["loaderData"]>();
  const fetcher = useFetcher<typeof action>();
  const content = data.page.hero;
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
    <LayoutSection
      className="min-h-[70vh] overflow-hidden"
      bg={cn(
        "pb-0",
        "lg:bg-[url('/root/hero.png')]",
        "lg:bg-[45vw_bottom]",
        "bg-no-repeat",
        "lg:bg-contain",
      )}
    >
      <div className="flex flex-col gap-4 max-w-xl">
        <Text as="h1" variant="headline-2">
          {content.headline}
        </Text>
        <Text as="p" variant="h3" weight="normal" className="text-gray-700">
          {content.deck}
        </Text>

        {fetcher.data?.success ? (
          <Alert variant="affirmative">
            <EmailNotification />
            <AlertTitle>
              {fetcher.data?.message ||
                "You're all set! Welcome to the Rec waitlist."}
            </AlertTitle>
            <AlertDescription>
              Check your email for updates and early access info.
            </AlertDescription>
          </Alert>
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

      <img src="/root/hero.png" alt="" className="w-full mt-4 lg:hidden" />
    </LayoutSection>
  );
}
