import { prisma } from "../../../generated/prisma-client";

export default {
  User: {
    //parent : 해당 resolver를 call한 resolver가 온다.
    // me의 결과물 중 user만 넘어온다. User라고 했으니까.
    fullName: (parent, __) => {
      return `${parent.firstName} ${parent.lastName}`;
    },

    isFollowing: async (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      try {
        const exists = await prisma.$exists.user({
          AND: [
            { id: user.id }, // 내가
            {
              following_some: {
                id: parentId // 쟤를 팔로우 하고 있냐?
              }
            }
          ]
        });
        return exists;
      } catch (error) {
        console.log(error);
        return false;
      }
    },

    itSelf: (parent, _, { request }) => {
      const { user } = request;
      const { id: parentId } = parent;
      return user.id === parentId;
    }
  }
};
