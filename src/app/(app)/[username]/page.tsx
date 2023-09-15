import MaxWidthContainer from "@/components/app/max-width-container";
import { prisma } from "@/db";
import { notFound } from "next/navigation";
import UserHeader from "./user-header";
import OwnProfileBanner from "./own-profile-banner";
import ChatCard from "./chat-card";
import { type DayAvailability } from "@/lib/availability";

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
      dnd: true,
      calendarLink: true,
      availability: true,
      timezone: true,
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
      <MaxWidthContainer className="py-10 flex items-center flex-col">
        <UserHeader
          name={user.name ?? ""}
          image={user.image}
          description={user.description ?? ""}
        />
        <ChatCard
          dnd={user.dnd}
          availability={user.availability as DayAvailability[]}
          timezone={user.timezone ?? ""}
        />
      </MaxWidthContainer>
    </>
  );
};

export default UserPage;
