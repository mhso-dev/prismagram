import { isAuthenticated } from "../../../middlewares";
import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    follow: async (_, args, { request }) => {
      isAuthenticated(request);
      const { id } = args;
      const { user } = request;
      try {
        await prisma.updateUser({
          where: { id: user.id }, // 로그인한 사용자가
          data: {
            following: {
              connect: {
                id // 대상 사용자에게 팔로우
              }
            }
          }
        });
        return true;
      } catch (error) {
        return false;
      }
    }
  }
};
