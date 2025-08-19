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
import { LayoutSection, LayoutDivider } from "~/ui/layout";

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
    <LayoutSection width="narrow" className="grid grid-cols-3 gap-y-8 gap-x-4">
      <img
        src={content.imgSrc}
        alt={content.imgAlt}
        className="col-span-3 rounded"
      />
      <div
        className={cn(
          "col-span-3 md:col-span-2",
          "flex flex-col gap-6",
          "text-balance",
        )}
      >
        <Text as="h1" variant="headline-3">
          {content.headline}
        </Text>
        <Text variant="h3" className="text-muted-foreground" weight="normal">
          {content.deck}
        </Text>
      </div>

      {fetcher.data?.success ? (
        <div
          className={cn(
            "col-span-3 lg:col-span-1",
            "self-start",
            "flex flex-col gap-3 items-start justify-center",
            "p-8",
            "bg-card",
            "border-2 border-affirmative/20",
            "rounded-lg",
          )}
        >
          <EmailNotification className="w-12 h-12 text-affirmative" />
          <div>
            <Text as="p" variant="h4" className="text-affirmative text-balance">
              {fetcher.data?.message || "You're all set!"}
            </Text>
            <Text
              as="p"
              variant="h6"
              weight="light"
              className="text-affirmative mt-2"
            >
              Check your email for updates and early access info.
            </Text>
          </div>
        </div>
      ) : (
        <div className="col-span-3 md:col-span-1">
          <Form {...form}>
            <form
              id="waitlist-email-only-form"
              name="waitlist-email-only-form"
              onSubmit={form.handleSubmit(onSubmit)}
              className={cn(
                "flex flex-col justify-between gap-5",
                "bg-card",
                "border-2  rounded-md",
                "p-4",
              )}
            >
              <Text className="text-muted-foreground">{content.cta}</Text>

              <LayoutDivider />

              <div className="flex flex-col gap-4">
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

                <Button type="submit" disabled={disabled}>
                  Join the Waitlist
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </LayoutSection>
  );
}
