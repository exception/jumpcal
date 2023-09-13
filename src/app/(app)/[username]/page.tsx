import MaxWidthContainer from "@/components/app/max-width-container";
import { prisma } from "@/db";
import { notFound } from "next/navigation";
import UserHeader from "./user-header";

const fetchUser = (username: string) => {
  return prisma.user.findUnique({
    where: {
      username,
    },
    select: {
      name: true,
      username: true,
      image: true,
      description: true,
      dnd: true,
      calendarLink: true,
      availability: true,
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
    <MaxWidthContainer className="py-10 flex items-center flex-col">
      <UserHeader
        name={user.name ?? ""}
        image={user.image ?? ""}
        description={user.description ?? ""}
      />
    </MaxWidthContainer>
  );
};

export default UserPage;
