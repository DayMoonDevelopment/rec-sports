import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useFetcher } from "react-router";

import { waitlistSchema, type WaitlistForm } from "~/lib/form-schemas";
import { EmailNotification } from "~/primitives/icons";
import { Text } from "~/primitives/text";
import type { action } from "~/routes/waitlist/route";
import { Alert, AlertTitle, AlertDescription } from "~/ui/alert";
import { Button } from "~/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/ui/form";
import { Input } from "~/ui/input";
import { LayoutDivider, LayoutSection } from "~/ui/layout";

export function Footer() {
  const fetcher = useFetcher<typeof action>();
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
    <footer>
      <LayoutDivider />
      <LayoutSection
        className="flex flex-col lg:flex-row align-center justify-between gap-16"
        id="waitlist"
      >
        <div className="flex flex-col gap-2 flex-[2]">
          <Text as="h2" variant="headline-3">
            Be the first the play with Rec!
          </Text>
          <Text
            as="p"
            variant="h1"
            weight="light"
            className="text-muted-foreground"
          >
            Join the waitlist now and get early access.
          </Text>
        </div>

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
              id="waitlist-form"
              name="waitlist-form"
              className="flex flex-col gap-2 flex-[1]"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="First Name"
                          disabled={disabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem className="col-span-1">
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Last Name"
                          disabled={disabled}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Email</FormLabel>
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

              <Button className="self-end" type="submit" disabled={disabled}>
                Submit
              </Button>
            </form>
          </Form>
        )}
      </LayoutSection>

      <div className="bg-card text-muted-foreground p-4 border-t-2 ">
        <div className="container mx-auto text-center">
          <p>
            {`© ${new Date().getFullYear()} `}
            <Link
              to="https://www.daymoon.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-gray-700"
            >
              Day Moon Development.
            </Link>
            {" All rights reserved."}
          </p>

          <p className="text-xs mt-2">Map data from OpenStreetMap.</p>
        </div>
      </div>
    </footer>
  );
}
