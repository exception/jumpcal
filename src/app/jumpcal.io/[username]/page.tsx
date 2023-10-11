import MaxWidthContainer from "@/components/app/max-width-container";
import { prisma } from "@/db";
import { notFound } from "next/navigation";
import UserHeader from "./user-header";
import OwnProfileBanner from "./own-profile-banner";
import AvailabilityCard from "./availability-card";
import { type DayAvailability } from "@/lib/availability";
import { cn } from "@/lib/utils";
import SeparatorWithText from "@/components/ui/separator-with-text";
import CalEmbed from "./(embeds)/cal-embed";
import CalendlyEmbed from "./(embeds)/calendly-embed";

const fetchUser = (username: string) => {
  return prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      description: true,
      calendarLink: true,
      availability: true,
      timezone: true,
      layout: true,
    },
  });
};

interface Props {
  params: {
    username: string;
  };
}

const UserPage = async ({ params }: Props) => {
  const user = await fetchUser(params.username.toLowerCase());

  if (!user) {
    return notFound();
  }

  return (
    <>
      <OwnProfileBanner id={user.id} />
      <MaxWidthContainer
        className={cn(
          "py-10 flex",
          user.layout === "VERTICAL"
            ? "flex-col space-y-4 items-center"
            : "flex-row space-x-6 items-start",
        )}
      >
        <UserHeader
          name={user.name ?? ""}
          image={user.image}
          description={user.description ?? ""}
          layout={user.layout}
          timeZone={user.timezone ?? "EST"}
        />
        <div className="max-w-4xl w-full space-y-4">
          <AvailabilityCard
            id={user.id}
            availability={user.availability as DayAvailability[]}
            timezone={user.timezone ?? ""}
            layout={user.layout}
            name={user.name ?? ""}
          />
          {user.calendarLink && (
            <>
              <SeparatorWithText text="OR" />
              {user.calendarLink.includes("cal.com") ? (
                <CalEmbed calendarLink={user.calendarLink} />
              ) : (
                <CalendlyEmbed calendarLink={user.calendarLink} />
              )}
            </>
          )}
        </div>
      </MaxWidthContainer>
    </>
  );
};

export default UserPage;
