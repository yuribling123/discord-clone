import { Server, Member, Profile } from "@prisma/client";

//combines all properties of a Server with an additional members array, 
//where each member includes all properties of a Member plus a profile of type Profile.
export type ServerWithMembersWithProfiles = Server & {
  members: (Member & { profile: Profile })[];
};
